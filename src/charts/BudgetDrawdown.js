import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official'
import _ from "lodash";
import { DRUID_DATA_SOURCE, CHART_POLL_TIMER, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;

var druidQueryParams = {
    "queryType": "topN",
    "dataSource": DRUID_DATA_SOURCE,
    "aggregations": [
      {
        "type": "doubleSum",
        "name": "sum__TotalSpent",
        "fieldName": "TotalSpent"
      }
    ],
    "granularity": "all",
    "postAggregations": [],
    "intervals": "2019-01-01T00:00:00+00:00/2019-12-31T00:00:00+00:00",
    "threshold": 10000,
    "metric": "sum__TotalSpent",
    "dimension": "program_code"
};
// Test DATA
/*
{
    name: 'Start',
    y: 120000
}, {
    name: 'Product Revenue',
    y: 569000
}, {
    name: 'Service Revenue',
    y: 231000
}, {
    name: 'Positive Balance',
    isIntermediateSum: true,
    color: Highcharts.getOptions().colors[1]
}, {
    name: 'Fixed Costs',
    y: -342000
}, {
    name: 'Variable Costs',
    y: -233000
}, {
    name: 'Balance',
    isSum: true,
    color: Highcharts.getOptions().colors[1]
}
*/
class BudgetDrawdown extends Component {
  state = {
    programs: [],
    chartOptions: {
      chart: {
        type: 'waterfall',
        height: this.props.height || null,
      },

      title: {
        text: 'Budget Drawdown'
      },
      subtitle: {
          text: ''
      },
      xAxis: {
        type: 'category'
      },

      yAxis: {
        title: {
          text: 'USD'
        }
      },

      legend: {
        enabled: false
      },

      tooltip: {
        pointFormat: '<b>${point.y:,.2f}</b> USD'
      },

      series: [{
        upColor: Highcharts.getOptions().colors[2],
        color: Highcharts.getOptions().colors[3],
        data: [],
        dataLabels: {
            enabled: true,
            formatter: function () {
                return Highcharts.numberFormat(this.y / 1000000, 0, ',') + 'M';
            },
            style: {
                fontWeight: 'bold'
            }
        },
        pointPadding: 0
      }]
    }
  }

  calculateTotalCommitment = (programs, office) => {
    if (office) {
      let sum = _.sumBy(Object.keys(office), function(objKey) {
        if (objKey.includes("028")) {
          return office[objKey];
        }
        return 0;
      });
      return sum;
    } else if (programs && programs.length > 0) {
      return _.sumBy(programs, function(program) {
        return program.target;
      });
    }
    return 0;
  };

  calculateChartData = (programs, office) => {
    return [
      {
        name: "Total Budget",
        y: this.calculateTotalCommitment(programs, office),
        color: Highcharts.getOptions().colors[9]
      },
      ...programs.map(program => {
        return { ...program, y: 0, program_code: program.code, color: Highcharts.getOptions().colors[5] };
      }),
      {
        name: 'Budget Remaining',
        isSum: true,
        color: Highcharts.getOptions().colors[9]
      }
    ];
  }

  componentDidMount() {
    fetchPrograms().then(programs => {
      this.setState({
        programs,
        chartOptions: {
          series: [{
            ...this.state.chartOptions.series[0],
            data: this.calculateChartData(programs),
          }]
        }
      }, () => {
        this.fetchTransactionsByProgram();
      });
    })
  }

  fetchTransactionsByProgram = () => {
    const { filters } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }
    fetchDruidData(queryParams).then(data => {
      let computedResults = [];//sum__TotalSpent
      let chartData = this.state.chartOptions.series[0].data;
      let druidData = data[0].result;

      for (let i = 0; i < chartData.length; i++) {
        for (let j = 0; j < druidData.length; j++) {
          if (chartData[i].program_code === druidData[j].program_code) {
            computedResults.push({
              ...chartData[i],
              y: -druidData[j].sum__TotalSpent
            });
          }
        }
      }
      this.setState({
        chartOptions: {
          series: [{
            ...this.state.chartOptions.series[0],
            data: [
              this.state.chartOptions.series[0].data[0],
              ...computedResults,
              {
                name: 'Budget Remaining',
                isSum: true,
                color: Highcharts.getOptions().colors[9]
              }
            ],
          }]
        }
      }, () => {
        setTimeout(() => {
          this.fetchTransactionsByProgram();
        }, CHART_POLL_TIMER);
      });
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.filters !== prevProps.filters) {
      let chartName = "";
      let filters = {};
      let filterOffice = null;
      if (this.props.filters.officeId) {
        this.props.offices.map(office => {
          if (office.id === this.props.filters.officeId) {
            chartName = `${office.name} Budget Drawdown`;
            filterOffice = office;
          }
        });
        filters = {
          filter: {
            type: "selector",
            dimension: "office_id",
            value: this.props.filters.officeId
          }
        };
      } else {
        chartName = "Budget Drawdown";
      }
      this.setState({
        filters,
        chartOptions: {
          ...this.state.chartOptions,
          title: { text: chartName },
          series: [{
            ...this.state.chartOptions.series[0],
            data: [
              {
                name: "Total Budget",
                y: this.calculateTotalCommitment(this.props.programs, filterOffice),
                color: Highcharts.getOptions().colors[9]
              },
              ..._.drop(this.state.chartOptions.series[0].data)
            ]
          }]
        },
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

export default BudgetDrawdown;
