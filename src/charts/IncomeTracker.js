import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official'

const ChartWrapperStyles = styled(Card)`
  background: #fff;
  height: 500px;
  width: 500px;
`;

var options = {
  chart: {
    type: 'column'
  },

  title: {
    text: 'Budget Vs. Actual'
  },
  subtitle: {
      text: 'Source: Druid'
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
    series: [{
        name: 'Budget',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }, {
        name: 'Actual',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

    }]
};

class IncomeTracker extends Component {
  render() {
    return (
      <ChartWrapperStyles>
        <div style={{ width: "1200px", height: "400px"}}>
          <HighchartsReact
            options={options}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default IncomeTracker;
