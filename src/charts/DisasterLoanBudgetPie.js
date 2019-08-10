import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import HighchartsReact from 'highcharts-react-official';
import _ from "lodash";
import { DISASTER_LOAN_PROGRAM_CODE, fetchOffices, fetchDruidData } from "../services/ChartService.js";

const ChartWrapperStyles = styled(Card)`
  background: #fff;
`;
class DisasterLoanBudgetPie extends Component {
  state = {
    chartOptions: {
      chart: {
	        type: 'pie',
          height: this.props.height || null,
	    },

	    plotOptions: {
	        pie: {
	            innerSize: '70%'
	        }
	    },

      title: {
          // verticalAlign: 'middle',
          floating: true,
          text: 'Disaster Loan Budget By Office'
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
      let sum = _.sumBy(offices, function(office) { return office[DISASTER_LOAN_PROGRAM_CODE] });

      this.setState({
        offices,
        chartOptions: {
          series: [{
            name: 'Budget',
            colorByPoint: true,
            data: offices.map(office => {
              return [office.name, Math.round(office[DISASTER_LOAN_PROGRAM_CODE]/sum*100)]
            })
          }],
          subtitle: {
            verticalAlign: 'middle',
            floating: true,
            text: `Total: ${Math.round(sum/1000000)}M`
          }
        }
      });
    });
  }

  render() {
    return (
      <ChartWrapperStyles>
        <div>
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
