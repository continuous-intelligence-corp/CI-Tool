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
var druidQueryParams = {
  "queryType": "timeseries",
  "dataSource": "transaction2",
  "aggregations": [
    {
      "fieldName": "TotalSpent",
      "fieldNames": [
        "TotalSpent"
      ],
      "type": "doubleSum",
      "name": "SUM(TotalSpent)"
    }
  ],
  "granularity": {
    "type": "period",
    "timeZone": "UTC",
    "origin": "2019-07-21T21:54:36",
    "period": "PT5S"
  },
  "postAggregations": [],
  "intervals": "2019-07-20T23:55:00+00:00/2019-07-21T00:00:00+00:00"
};

class TransactionTracker extends Component {
  state = {
    programs: [],
    chartOptions: {
      chart: {
        type: 'column',
        height: this.props.height || null,
      },
      title: {
        text: 'Transaction Tracker'
      },
      subtitle: {
          text: '(Last 5 mins)'
      },
      xAxis: {
          categories: [],
          crosshair: true
      },
      yAxis: {
          min: 0,
          title: {
              text: 'USD'
          }
      },
      tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.1f} USD</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
      },
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
    this.fetchTransactionsByProgram();
  }

  setTimeIntervals = queryParams => {
    let now = new Date();
    let fiveMinsAgo = new Date(now.getTime() - 10*60000);
    queryParams.intervals = `${fiveMinsAgo.toISOString()}/${now.toISOString()}`;
  }
  fetchTransactionsByProgram = () => {
    const { filters } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }
    this.setTimeIntervals(queryParams);
    fetchDruidData(queryParams).then(data => {
      let xAxis = [];
      let yAxis = [];
      data.map(dataEntry => {
        let date = new Date(dataEntry.timestamp);
        xAxis.push(date.toLocaleString());
        yAxis.push(dataEntry.result["SUM(TotalSpent)"]);
      });
      this.setState({
        chartOptions: {
          xAxis: {
              categories: xAxis,
              crosshair: true
          },
          series: [
            {
              name: "Actual",
              data: yAxis
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
      const { officeId, programCode, chartType } = this.props.filters;
      if (officeId || programCode) {
        if (programCode) {
          this.props.programs.map(program => {
            if (program.code === programCode) {
              chartName = `${program.name} Monthly Budget`;
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
                chartName = `Monthly Budget For ${office.name}`;
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
        chartName = "Monthly Budget";
      }
      this.setState({
        filters,
        chartOptions: {
          ...this.state.chartOptions,
          title: { text: chartName },
          chart: {
            type: chartType || 'column',
            height: this.props.height || null,
          },
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

export default TransactionTracker;
