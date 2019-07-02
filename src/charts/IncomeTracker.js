import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official'
import { CHART_POLL_TIMER, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
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
      "type": "doubleSum",
      "name": "sum__TotalSpent",
      "fieldName": "TotalSpent"
    }
  ],
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
        type: 'column'
      },

      title: {
        text: 'Monthly Budget'
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
    fetchPrograms().then(programs => {
      let monthlyBudget = _.sumBy(programs, function(program) { return program.commitment; })/12;
      this.setState({
        programs,
        chartOptions: {
          series: [{
            name: "Budget",
            data: Array.from({length: 12}, () => Math.round(monthlyBudget/1000)*1000),
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
    fetchDruidData(druidQueryParams).then(data => {
      let actualData = Array.from({length: 12}, () => 0);
      data.map(dataMonth => {
        let date = new Date(dataMonth.timestamp);
        actualData[date.getUTCMonth()] = dataMonth.result.sum__TotalSpent;
      });
      this.setState({
        chartOptions: {
          series: [
            this.state.chartOptions.series[0],
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
