import React, { Fragment } from "react";
import { Row, Col } from 'antd';
import ChartController from "../components/ChartController";
import { fetchOffices, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
import BudgetDrawdown from "../charts/BudgetDrawdown";
import IncomeTracker from "../charts/IncomeTracker";
import TransactionTracker from "../charts/TransactionTracker";
import OfficeComparison from "../charts/OfficeComparison";
import RegionalBudget from "../charts/RegionalBudget";
import RegionalTransaction from "../charts/RegionalTransaction";
import styled from "styled-components";

const StyledCharts = styled.div`
  .ant-row {
    margin-top: 25px;
  }

  .ant-card-body {
    /* background: #353537; */
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

  handleSetFilters = filters => {
    this.setState({ filters });
  }

  renderChart() {
    const { filters, offices, programs } = this.state;
    let url = this.props.location.pathname;
    switch (url) {
      case "/charts/budgetdrawdown":
        return <BudgetDrawdown offices={offices} programs={programs} filters={filters} height={500} />;
      case "/charts/incometracker":
        return <IncomeTracker programs={programs} offices={offices} filters={filters} height={500} />;
      case "/charts/regionalcomparison":
        return <OfficeComparison programs={programs} offices={offices} filters={filters} height={500} />;
      case "/charts/transactionTracker":
        return <TransactionTracker programs={programs} offices={offices} filters={filters} height={500} />;
      case "/charts/regionalbudget":
        return <RegionalBudget programs={programs} filters={filters} height={500} />;
      case "/charts/regionaltransaction":
        return <RegionalTransaction programs={programs} offices={offices} filters={filters} height={500} />;
      default:
        return null;
    }

  }
  render() {
    const { offices, programs } = this.state;
    return (
      <StyledCharts>
        {this.props.location.pathname === "/charts/transactionTracker" ? (
          <Row gutter={24}>
          <Col span={24}>
            {this.renderChart()}
          </Col>
        </Row>
        ) : (
          <Row gutter={24}>
          <Col span={18}>
            {this.renderChart()}
          </Col>
          <Col span={6}>
            <ChartController
              chartRoute={this.props.location.pathname}
              offices={offices}
              programs={programs}
              handleSetFilters={this.handleSetFilters}
            />
          </Col>
        </Row>
        )}
      </StyledCharts>
    );
  }
}

export default Charts;
