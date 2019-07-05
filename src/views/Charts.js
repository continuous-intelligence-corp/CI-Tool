import React, { Fragment } from "react";
import { Row, Col } from 'antd';
import ChartController from "../components/ChartController";
import { fetchOffices, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
import BudgetDrawdown from "../charts/BudgetDrawdown";
import DisasterLoan from "../charts/DisasterLoan";
import IncomeTracker from "../charts/IncomeTracker";
import RegionalBudget from "../charts/RegionalBudget";
import styled from "styled-components";

const StyledCharts = styled.div`
  .ant-row {
    margin-top: 25px;
  }
`;
class Charts extends React.Component {
  state = {
    offices: [],
    programs: [],
    filters: {},
  }

  componentDidMount() {
    fetchPrograms().then(programs => {
      this.setState({ programs });
    });
    fetchOffices().then(offices => {
      this.setState({ offices });
    });
  }

  renderChart() {
    const { filters } = this.state;
    let url = this.props.location.pathname;
    switch (url) {
      case "/charts/budgetdrawdown":
        return <BudgetDrawdown filters={filters} height={500} />;
      case "/charts/disasterloan":
        return <DisasterLoan filters={filters} height={500} />;
      case "/charts/incometracker":
        return <IncomeTracker filters={filters} height={500} />;
      case "/charts/regionalbudget":
        return <RegionalBudget filters={filters} height={500} />;
      default:
        return null;
    }

  }
  render() {
    const { offices, programs } = this.state;
    return (
      <StyledCharts>
        <Row gutter={24}>
          <Col span={18}>
            {this.renderChart()}
          </Col>
          <Col span={6}>
            <ChartController offices={offices} programs={programs} />
          </Col>
        </Row>
      </StyledCharts>
    );
  }
}

export default Charts;
