import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import { Link } from "react-router-dom";
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import BudgetDrawdown from "../charts/BudgetDrawdown.js";
import IncomeTracker from "../charts/IncomeTracker.js";
import DisasterLoan from "../charts/DisasterLoan.js";
import DisasterLoanBudgetPie from "../charts/DisasterLoanBudgetPie.js";
import RegionalBudget from "../charts/RegionalBudget.js";

const StyledDashboard = styled.div`
  .ant-row {
    margin-top: 25px;
  }
`;

let data = {
        queryType: "timeseries",
        dataSource: "transaction2",
        intervals: ["2019-05-20/2019-06-05"],
        granularity: "day",
};
class Dashboard extends Component {
  render() {
    return (
      <StyledDashboard>
        <Row gutter={24}>
          <Col span={16}>
            <Link to={"/charts/budgetdrawdown"}>
              <BudgetDrawdown />
            </Link>
          </Col>
          <Col span={8}>
            <DisasterLoanBudgetPie />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Link to={"/charts/regionalbudget"}>
              <RegionalBudget />
            </Link>
          </Col>
          <Col span={8}>
            <Link to={"/charts/incometracker"}>
              <IncomeTracker />
            </Link>
          </Col>
          <Col span={8}>
            <Link to={"/charts/disasterloan"}>
              <DisasterLoan />
            </Link>
          </Col>
        </Row>
      </StyledDashboard>
    );
  }
}

export default Dashboard;
