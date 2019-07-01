import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import { fetchOffices, fetchDruidData } from "../services/ChartService.js";

const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;
var H = Highcharts,
    map = Highcharts.maps['countries/us/us-all'],
    chart;

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
    "dimension": "office_id"
};
class RegionalBudget extends Component {
  state = {
    chartOptions: {
      title: {
          text: 'Regional Budget'
      },

      tooltip: {
          pointFormat: '{point.name}<br>' +
              'Total Budget: {point.budget}<br>' +
              'Total Spent: {point.actual}<br>' +
              'Budget Remaining: {point.remain}'
      },

      xAxis: {
          crosshair: {
              zIndex: 5,
              dashStyle: 'dot',
              snap: false,
              color: 'gray'
          }
      },

      yAxis: {
          crosshair: {
              zIndex: 5,
              dashStyle: 'dot',
              snap: false,
              color: 'gray'
          }
      },

      series: [{
          name: 'Basemap',
          mapData: map,
          borderColor: '#606060',
          nullColor: 'rgba(200, 200, 200, 0.2)',
          showInLegend: false
      }, {
          name: 'Separators',
          type: 'mapline',
          data: Highcharts.geojson(map),
          color: '#101010',
          enableMouseTracking: false,
          showInLegend: false
      }, {
          type: 'mapbubble',
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          },
          name: 'Offices',
          data: [],
          maxSize: '20%',
          color: H.getOptions().colors[2]
      }]
    }
  }

  componentDidMount() {
    fetchOffices().then(offices => {
      offices = offices.map(office => {
        let budget = 0;

        Object.keys(office).map(key => {
          if (key.includes("028")) {
            budget += office[key];
          }
        });
        let actual = 0;
        return {
          ...office,
          budget,
          actual,
          remain: budget-actual,
          z: budget-actual,
          lat: office.latitude,
          lon: office.longitude
        };
      });
      this.setState({
        offices,
      }, this.fetchTransactionsByOffice());
    });
  }

  fetchTransactionsByOffice = () => {
    fetchDruidData(druidQueryParams).then(data => {
      // let computedResults = [];//sum__TotalSpent
      let offices = this.state.offices;
      let druidData = data[0].result;
      druidData.map(druidOfficeData => {
        let officeId = parseInt(_.trimStart(druidOfficeData["office_id"], 'O'), 10);
        offices.map(chartOfficeData => {
          if (chartOfficeData.id === officeId) {
            chartOfficeData.actual = druidOfficeData["sum__TotalSpent"];
            chartOfficeData.remain = chartOfficeData.budget - chartOfficeData.actual;
            chartOfficeData.z = chartOfficeData.remain;
          }
        });
      });
      let series = this.state.chartOptions.series;
      series[2].data = offices;
      this.setState({
        offices,
        chartOptions: {
          series
        }
      })
    })
  }
  render() {
    return (
      <ChartWrapperStyles>
        <div>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'mapChart'}
            options={this.state.chartOptions || {}}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default RegionalBudget;
