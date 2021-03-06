import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official'
import { setDruidDataSourceForQuery, DRUID_DATA_SOURCE, CHART_POLL_TIMER, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
import _ from "lodash";

const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;

// var druidQueryParams = {
//   queryType: "topN",
//   dataSource: "transaction2",
//   aggregations: [
//     {
//       fieldName: "TotalSpent",
//       fieldNames: [
//         "TotalSpent"
//       ],
//       type: "doubleSum",
//       name: "SUM(TotalSpent)"
//     }
//   ],
//   granularity: "all",
//   postAggregations: [],
//   intervals:
//   threshold: 10000,
//   metric: "SUM(TotalSpent)",
//   dimension: "date"
// }
//

const SUM_TOTALSPENT = [
  {
    "type": "doubleSum",
    "name": "sum__TotalSpent",
    "fieldName": "TotalSpent"
  }
];

const COUNT_TRANSACTION = [
  {
    "type": "count",
    "name": "count"
  }
];

const SUM_TOOLTIP = {
    formatter: function () {

      return this.points.reduce(function (s, point) {
                return s + '<br/>' + point.series.name + ': $' +
                    Highcharts.numberFormat(point.y, 0,',',',') + ' USD';
            }, '<b>' + this.x + '</b>');
    },
    shared: true,
};

const COUNT_TOOLTIP = {
  formatter: function () {

    return this.points.reduce(function (s, point) {
              return s + '<br/>' + "Transactions" + ': ' +
                  Highcharts.numberFormat(point.y, 0,',',',') + '';
          }, '<b>' + this.x + '</b>');
  },
  shared: true,
}
var druidQueryParams = {
  "queryType": "timeseries",
  "dataSource": DRUID_DATA_SOURCE,
  "aggregations": SUM_TOTALSPENT,
  "granularity": {
    "type": "period",
    "timeZone": "UTC",
    "period": "P1M"
  },
  "postAggregations": [],
  "intervals": "2019-01-01T00:00:00+00:00/2019-12-31T00:00:00+00:00",
};

class IncomeTracker extends Component {
  state = {
    programs: [],
    chartOptions: {
      chart: {
        type: 'column',
        height: this.props.height || null,
      },
      title: {
        text: 'Budget vs Actuals By Month'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
          categories: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec'
          ],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'USD'
          }
      },
      tooltip: SUM_TOOLTIP,
      plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
      },
      series: []
    }
  };
  componentDidMount() {
    setDruidDataSourceForQuery(druidQueryParams);
    fetchPrograms().then(programs => {
      let monthlyBudget = _.sumBy(programs, function(program) { return program.target; })/12;
      let monthlyBudgetArray = Array.from({length: 12}, () => Math.round(monthlyBudget/1000)*1000);
      this.setState({
        monthlyBudgetArray,
        programs,
        chartOptions: {
          series: [{
            name: "Budget",
            data: monthlyBudgetArray,
          }, {
            name: "Actual",
            data: [],
          }]
        }
      }, () => {
        this.fetchTransactionsByProgram();
      })
    })
  }
  fetchTransactionsByProgram = () => {
    let resultProperty = "sum__TotalSpent";
    const { filters, transactionType } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }

    if (transactionType === "count") {
      queryParams.aggregations = COUNT_TRANSACTION;
      resultProperty = "count";
    } else {
      queryParams.aggregations = SUM_TOTALSPENT;
    }
    fetchDruidData(queryParams).then(data => {
      let actualData = Array.from({length: 12}, () => 0);
      data.map(dataMonth => {
        let date = new Date(dataMonth.timestamp);
        actualData[date.getUTCMonth()] = dataMonth.result[resultProperty];
      });
      this.setState({
        chartOptions: {
          series: [
            {
              name: "Budget",
              data: transactionType === "count" ? [] : this.state.monthlyBudgetArray,
            },
            {
              name: "Actual",
              data: actualData,
            }
          ]
        }
      }, () => {
        setTimeout(() => {
          this.fetchTransactionsByProgram();
        }, CHART_POLL_TIMER);
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.filters !== prevProps.filters) {
      let chartName = "";
      let filters = {};
      let filterProgram = null;
      let filterOffice = null;
      const { officeId, programCode, chartType, transactionType } = this.props.filters;

      let transactionTitle = transactionType === "count" ? "Transactions" : "Budget";
      let yAxisType = transactionType === "count" ? "Transactions" : "USD";
      if (officeId || programCode) {
        if (programCode) {
          this.props.programs.map(program => {
            if (program.code === programCode) {
              chartName = `${program.name} - Monthly ${transactionTitle}`;
              filterProgram = program;
            }
          });
          filters = {
            filter: {
              type: "selector",
              dimension: "program_code",
              value: `${filterProgram.code}`
            }
          };
        }
        if (officeId) {
          this.props.offices.map(office => {
            if (office.id === officeId) {
              if (chartName) {
                chartName += ` For ${office.name}`;
              } else {
                chartName = `Monthly ${transactionTitle} For ${office.name}`;
              }
              filterOffice = office;
            }
          });
          let officeFilter = {
            type: "selector",
            dimension: "office_id",
            value: `${filterOffice.id}`
          };
          if (filters.filter) {
            filters = {
              filter: {
                type: "and",
                fields: [
                  filters.filter,
                  officeFilter
                ]
              }
            }
          } else {
            filters = {
              filter: officeFilter
            };
          }
        }
      } else {
        chartName = `Monthly ${transactionTitle}`;
      }
      this.setState({
        transactionType,
        filters,
        chartOptions: {
          ...this.state.chartOptions,
          title: { text: chartName },
          chart: {
            type: chartType || 'column',
            height: this.props.height || null,
          },
          yAxis: {
              min: 0,
              title: {
                  text: yAxisType,
              }
          },
          tooltip: transactionType === "count" ? COUNT_TOOLTIP : SUM_TOOLTIP,
        }
      }, () => {
        this.fetchTransactionsByProgram();
      });
    }
  }
  render() {
    const { chartOptions } = this.state;
    return (
      <ChartWrapperStyles>
        <div>
          <HighchartsReact
            options={chartOptions}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default IncomeTracker;
