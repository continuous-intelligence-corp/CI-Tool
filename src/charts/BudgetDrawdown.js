import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official'
import _ from "lodash";
import { fetchPrograms, fetchDruidData } from "../services/ChartService.js";
const ChartWrapperStyles = styled(Card)`
  background: #fff;
  height: 500px;
  width: 500px;
`;

var druidQueryParams = {
    "queryType": "topN",
    "dataSource": "transaction2",
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
        type: 'waterfall'
      },

      title: {
        text: 'Budget Drawdown'
      },
      subtitle: {
          text: 'Source: Druid'
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
                return Highcharts.numberFormat(this.y / 1000, 0, ',') + 'k';
            },
            style: {
                fontWeight: 'bold'
            }
        },
        pointPadding: 0
      }]
    }
  }

  componentDidMount() {
    fetchPrograms().then(programs => {
      this.setState({
        programs,
        chartOptions: {
          series: [{
            ...this.state.chartOptions.series[0],
            data: [
              {
                name: "Total Budget",
                y: _.sumBy(programs, function(program) { return program.commitment; }),
                color: Highcharts.getOptions().colors[1]
              },
              ...programs.map(program => {
                return { ...program, y: 0, program_code: program.code === 28001 ? "028-001" : program.code === 28002 ? "028-002": null };
              }),
              {
                name: 'Budget Remaining',
                isSum: true,
                color: Highcharts.getOptions().colors[1]
              }
            ],
          }]
        }
      }, () => {
        this.fetchTransactionsByProgram();
      });
    })
  }

  fetchTransactionsByProgram = () => {
    fetchDruidData(druidQueryParams).then(data => {
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
                color: Highcharts.getOptions().colors[1]
              }
            ],
          }]
        }
      });
    })
  }
  render() {
    const { chartOptions } = this.state;
    return (
      <ChartWrapperStyles>
        <div style={{ width: "1200px", height: "400px"}}>
          <HighchartsReact
            options={chartOptions}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default BudgetDrawdown;
