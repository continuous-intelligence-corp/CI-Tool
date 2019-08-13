import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import {  setDruidDataSourceForQuery, DRUID_DATA_SOURCE, CHART_POLL_TIMER, DISASTER_LOAN_PROGRAM_CODE, fetchOffices, fetchDruidData } from "../services/ChartService.js";

const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;
var H = Highcharts,
    map = Highcharts.maps['countries/us/us-all'],
    chart;

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
    "intervals": "2019-07-01T00:00:00+00:00/2019-08-31T00:00:00+00:00",
    "filter": {
      "type": "selector",
      "dimension": "program_code",
      "value": DISASTER_LOAN_PROGRAM_CODE
    },
    "threshold": 10000,
    "metric": "sum__TotalSpent",
    "dimension": "office_id"
};
class DisasterLoan extends Component {
  state = {
    chartOptions: {
      chart: {
        height: this.props.height || null,
      },
      title: {
          text: 'Disaster Loans Budget Variance'
      },

      tooltip: {
        formatter: function () {
            return '<b>' + this.point.name + '</b><br/>' +
            'Total Budget: $' + Highcharts.numberFormat(this.point.budget, 0,',',',') + " USD<br/>" +
            'Total Spent: $' + Highcharts.numberFormat(this.point.actual, 0,',',',') + " USD<br/>" +
            'Budget Remaining: $' + Highcharts.numberFormat(this.point.remain, 0,',',',') + " USD<br/>";
        },
      },
      mapNavigation: {
                    enabled: true
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
          maxSize: '15%',
          color: H.getOptions().colors[10]
      }]
    }
  }

  componentDidMount() {
    setDruidDataSourceForQuery(druidQueryParams);
    if (this.props.timeout) {
      setTimeout(() => {
        this.initialCall();
      }, this.props.timeout)
    } else {
      this.initialCall();
    }
  }

  initialCall = () => {
    fetchOffices().then(offices => {
      offices = offices.map(office => {
        console.log("office", office);
        console.log("DISASTER_LOAN_PROGRAM_CODE", DISASTER_LOAN_PROGRAM_CODE);
        let budget = office[DISASTER_LOAN_PROGRAM_CODE];
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
        let officeId = druidOfficeData["office_id"];
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
      }, () => {
        setTimeout(() => {
          this.fetchTransactionsByOffice();
        }, CHART_POLL_TIMER);
      });
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

export default DisasterLoan;
