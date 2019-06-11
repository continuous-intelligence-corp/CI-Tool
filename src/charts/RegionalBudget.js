import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official';


const ChartWrapperStyles = styled(Card)`
  background: #fff;
  height: 500px;
  width: 500px;
`;
var H = Highcharts,
    map = Highcharts.maps['countries/us/us-all'],
    chart;

class RegionalBudget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        title: {
            text: 'Highmaps lat/lon demo'
        },

        tooltip: {
            pointFormat: '{point.capital}, {point.parentState}<br>' +
                'Lat: {point.lat}<br>' +
                'Lon: {point.lon}<br>' +
                'Population: {point.population}'
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
                format: '{point.capital}'
            },
            name: 'Cities',
            data: [],
            maxSize: '12%',
            color: H.getOptions().colors[0]
        }]
      }
    }
  }
  // componentDidMount() {
  //   fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/us-capitals.json')
  //     .then(function(response) {
  //       console.log("response", response);
  //       // The response is a Response instance.
  //       // You parse the data into a useable format using `.json()`
  //       return response.json();
  //     }).then((data) => {
  //       // `data` is the parsed version of the JSON returned from the above endpoint.
  //       console.log("MY CHART DATA", data);
  //       data.map((item) => {
  //         item.z = item.population;
  //       });
  //       this.setState({
  //         options: {
  //           series: [{
  //               name: 'Basemap',
  //               mapData: map,
  //               borderColor: '#606060',
  //               nullColor: 'rgba(200, 200, 200, 0.2)',
  //               showInLegend: false
  //           }, {
  //               name: 'Separators',
  //               type: 'mapline',
  //               data: Highcharts.geojson(map),
  //               color: '#101010',
  //               enableMouseTracking: false,
  //               showInLegend: false
  //           }, {
  //               type: 'mapbubble',
  //               dataLabels: {
  //                   enabled: true,
  //                   format: '{point.capital}'
  //               },
  //               name: 'Cities',
  //               data: data,
  //               maxSize: '12%',
  //               color: H.getOptions().colors[0]
  //           }]
  //         }
  //       });
  //     });
  // }
  render() {
    return (
      <ChartWrapperStyles>
        <div style={{ width: "1200px", height: "400px"}}>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'mapChart'}
            options={this.state.options}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default RegionalBudget;
