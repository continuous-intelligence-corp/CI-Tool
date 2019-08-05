import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import { setDruidDataSourceForQuery, DRUID_DATA_SOURCE, CHART_POLL_TIMER, fetchOffices, fetchDruidData } from "../services/ChartService.js";
const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;
var H = Highcharts,
    map = Highcharts.maps['countries/us/us-all'],
    chart;



const SUM_TOOLTIP = {
    pointFormat: '{point.name}<br>' +
        'Total Budget: {point.budget}<br>' +
        'Total Spent: {point.actual}<br>' +
        'Budget Remaining: {point.remain}'
};

const COUNT_TOOLTIP = {
    pointFormat: '{point.name}<br>' +
        'Transactions: {point.count:.0f}<br>'
};

var druidQueryParams = {
    "queryType": "scan",
    "dataSource": DRUID_DATA_SOURCE,
    "intervals": "2019-01-01T00:00:00+00:00/2019-12-31T00:00:00+00:00",
    "threshold": 10000,
};
class RegionalTransaction extends Component {
  state = {
    offices: [],
    chartOptions: {

      chart: {
        height: this.props.height || null,
      },

      title: {
          text: 'Regional Budget By Office'
      },

      tooltip: SUM_TOOLTIP,

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
          maxSize: '20%',
          color: H.getOptions().colors[5]
      }]
    }
  }

  setTimeIntervals = queryParams => {
    let now = new Date();
    let weekAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
    queryParams.intervals = `${weekAgo.toISOString()}/${now.toISOString()}`;
  }

  componentDidMount() {
    setDruidDataSourceForQuery(druidQueryParams);
    this.fetchTransactionsByOffice()
  }

  fetchTransactionsByOffice = () => {
    const { filters, transactionType } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }

    this.setTimeIntervals(queryParams);

    fetchDruidData(queryParams).then(data => {
      console.log("!---------- DRUID DATA --------!", data);
      // let computedResults = [];//sum__TotalSpent
      let offices = this.state.offices;
      let druidData = data[0].result;
      offices.map(chartOfficeData => {
        chartOfficeData.count = 0;
        chartOfficeData.z = 0;
        chartOfficeData.actual = 0;
        chartOfficeData.remain = 0;
        druidData.map(druidOfficeData => {
          let officeId = druidOfficeData["office_id"];
          if (chartOfficeData.id === officeId) {
            if (transactionType === "count") {
              chartOfficeData.count = druidOfficeData["count"];
              chartOfficeData.z = chartOfficeData.count;
            } else {
              chartOfficeData.actual = druidOfficeData["sum__TotalSpent"];
              chartOfficeData.remain = chartOfficeData.budget - chartOfficeData.actual;
              chartOfficeData.z = chartOfficeData.remain;
            }
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

  componentDidUpdate(prevProps) {
    if (this.props.filters !== prevProps.filters) {
      let chartName = "";
      let filters = {};
      let filterProgram = null;
      let filterOffice = null;
      const { transactionType, programCode, officeId } = this.props.filters;
      let transactionTitle = transactionType === "count" ? "Transactions" : "Budget";
      let yAxisType = transactionType === "count" ? "Transactions" : "USD";
      if (this.props.filters.programCode) {
        this.props.programs.map(program => {
          if (program.code === this.props.filters.programCode) {
            chartName = `${program.name} ${transactionTitle} By Office`;
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
      } else {
        chartName = `Regional ${transactionTitle} By Office`;
      }
      if (officeId) {
        this.props.offices.map(office => {
          if (office.id === officeId) {
            chartName += `${office.name}`;
            filterOffice = office;
          }
        });
        if (filters.filter) {
          filters.filter = {
            type: "and",
            fields: [
              {
                type: "selector",
                dimension: "program_code",
                value: `${filterProgram.code}`
              },
              {
                type: "selector",
                dimension: "office_id",
                value: `${filterOffice.id}`
              }
            ],
          }
        } else {
          filters.filter = {
            type: "selector",
            dimension: "office_id",
            value: `${filterOffice.id}`
          };
        }
      }
      this.setState({
        transactionType,
        filters,
        chartOptions: {
          ...this.state.chartOptions,
          title: { text: chartName },
          tooltip: transactionType === "count" ? COUNT_TOOLTIP : SUM_TOOLTIP,
        },
      }, () => {
        this.fetchTransactionsByOffice();
      });
    }
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

export default RegionalTransaction;
