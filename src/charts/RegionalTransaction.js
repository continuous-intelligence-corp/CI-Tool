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
        'Total Commitment: {point.TotalSpent}<br>' +
        'Jobs Created: {point.jobsno}<br>' +
        'Risk Review: {point.riskreview}'
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
          text: 'Regional Transactions By Office'
      },

      subtitle: {
        text: "Commitment"
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
          name: 'Transactions',
          data: [],
          maxSize: '5%',
          color: H.getOptions().colors[5]
      },
      {
          type: 'mapbubble',
          dataLabels: {
              enabled: true,
              format: '{point.name}'
          },
          name: 'Risk Reviewed Transactions',
          data: [],
          maxSize: '5%',
          color: H.getOptions().colors[3]
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
    const { filters, displayValue } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }

    this.setTimeIntervals(queryParams);

    fetchDruidData(queryParams).then(data => {
      // let computedResults = [];//sum__TotalSpent
      let regularResults = [];
      let riskyResults = [];
      if (data && data.length > 0) {
        data.map(druidRow => {
          if (druidRow.events && druidRow.events.length > 0) {
            druidRow.events.map(transactionEvent => {
              if (transactionEvent.lat && transactionEvent.long) {
                if (transactionEvent.riskreview === "1") {
                  riskyResults.push({
                    z: displayValue === "jobs" ? parseInt(transactionEvent.jobsno) :transactionEvent.TotalSpent,
                    lon: transactionEvent.long,
                    ...transactionEvent
                  });
                } else {
                  regularResults.push({
                    z: displayValue === "jobs" ? parseInt(transactionEvent.jobsno) :transactionEvent.TotalSpent,
                    lon: transactionEvent.long,
                    ...transactionEvent
                  });
                }

              }
            });
          }
        })
      }
      let series = this.state.chartOptions.series;
      series[2].data = regularResults;
      series[3].data = riskyResults;
      this.setState({
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
      const { programCode, officeId, displayValue } = this.props.filters;
      let transactionTitle = "Transactions";
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
            chartName += ` ${office.name}`;
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
        displayValue,
        filters,
        chartOptions: {
          ...this.state.chartOptions,
          title: { text: chartName },
          subtitle: { text: displayValue === "jobs" ? "Number of Jobs Created" : "Commitment" },
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
