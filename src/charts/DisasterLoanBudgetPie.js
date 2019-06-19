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
class DisasterLoanBudgetPie extends Component {
  state = {
    chartOptions: {
      chart: {
	        type: 'pie'
	    },

	    plotOptions: {
	        pie: {
	            innerSize: '70%'
	        }
	    },

      title: {
          verticalAlign: 'middle',
          floating: true,
          text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },

	    series: [{
	        data: []
	    }]
    }
  }

  componentDidMount() {
    fetchOffices().then(offices => {
      let sum = _.sumBy(offices, function(office) { return office["028-001"] });

      this.setState({
        offices,
        chartOptions: {
          series: [{
            data: offices.map(office => {
              console.log("office", office);
              return [office.name, Math.round(office["028-001"]/sum*100)]
            })
          }],
          title: {
            verticalAlign: 'middle',
            floating: true,
            text: `Total Budget: ${sum/1000000}M`
          }
        }
      });
    });
  }

  render() {
    return (
      <ChartWrapperStyles
        title="Disaster Loan Budget By Office"
      >
        <div style={{ width: "550px", height: "100%"}}>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.state.chartOptions || {}}
          />
        </div>
      </ChartWrapperStyles>
    );
  }
}

export default DisasterLoanBudgetPie;
