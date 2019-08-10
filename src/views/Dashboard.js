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
  height: 90vh;
  .ant-row {
    margin-top: 25px;
    height: 50%;
    .ant-col-16, .ant-col-8 {
      height: 100%;
    }
  }
`;
class Dashboard extends Component {
  render() {
    return (
      <StyledDashboard>
        <Row gutter={24}>
          <Col span={16}>
            <Link to={"/charts/budgetdrawdown"}>
              <BudgetDrawdown height={"30%"} />
            </Link>
          </Col>
          <Col span={8}>
            <DisasterLoanBudgetPie height={"65%"} />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Link to={"/charts/regionalbudget"}>
              <RegionalBudget height={"65%"} />
            </Link>
          </Col>
          <Col span={8}>
            <Link to={"/charts/incometracker"}>
              <IncomeTracker height={"65%"} />
            </Link>
          </Col>
          <Col span={8}>
            <DisasterLoan height={"65%"} />
          </Col>
        </Row>
      </StyledDashboard>
    );
  }
}

export default Dashboard;
