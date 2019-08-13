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


const SUM_TOTALSPENT = [
  {
    "type": "doubleSum",
    "name": "sum__TotalSpent",
    "fieldName": "TotalSpent"
  }
];

const COUNT_TRANSACTION = [
  {
    "type": "count",
    "name": "count"
  }
];

const SUM_TOOLTIP = {
    formatter: function () {
        return '<b>' + this.point.name + '</b><br/>' +
        'Total Budget: $' + Highcharts.numberFormat(this.point.budget, 0,',',',') + " USD<br/>" +
        'Total Spent: $' + Highcharts.numberFormat(this.point.actual, 0,',',',') + " USD<br/>" +
        'Budget Remaining: $' + Highcharts.numberFormat(this.point.remain, 0,',',',') + " USD<br/>";
    },
};

const COUNT_TOOLTIP = {
      formatter: function () {
          return '<b>' + this.point.name + '</b><br/>' +
          'Transactions: ' + Highcharts.numberFormat(this.point.count, 0,',',',') + "<br/>";
      },
};

var druidQueryParams = {
    "queryType": "topN",
    "dataSource": DRUID_DATA_SOURCE,
    "aggregations": SUM_TOTALSPENT,
    "granularity": "all",
    "postAggregations": [],
    "intervals": "2019-07-01T00:00:00+00:00/2019-08-31T00:00:00+00:00",
    "threshold": 10000,
    "metric": "sum__TotalSpent",
    "dimension": "office_id"
};
class RegionalBudget extends Component {
  state = {
    offices: [],
    chartOptions: {

      chart: {
        height: this.props.height || null,
      },

      title: {
          text: 'Budget Variance By Office'
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
    const { filters, transactionType } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }

    if (transactionType === "count") {
      queryParams.aggregations = COUNT_TRANSACTION;
      queryParams.metric = "count";
    } else {
      queryParams.aggregations = SUM_TOTALSPENT;
      queryParams.metric = "sum__TotalSpent";
    }
    fetchDruidData(queryParams).then(data => {
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

      const { transactionType } = this.props.filters;
      let transactionTitle = transactionType === "count" ? "Transactions" : "Budget Variance";
      let yAxisType = transactionType === "count" ? "Transactions" : "USD";
      if (this.props.filters.programCode) {
        this.props.programs.map(program => {
          if (program.code === this.props.filters.programCode) {
            chartName = `${transactionTitle} By Office - ${program.name}`;
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
        chartName = `${transactionTitle} By Office`;
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

export default RegionalBudget;
