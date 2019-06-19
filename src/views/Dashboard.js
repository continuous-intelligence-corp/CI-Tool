import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
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
  .ant-col-6 > div {
    height: 200px;
  }
  .ant-col-24 > div {
    width: 100%;

    height: 500px;
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
        <Row>
          <Col span={24}>
            <BudgetDrawdown />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <IncomeTracker />
          </Col>
          <Col span={12}>
            <RegionalBudget />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <DisasterLoan />
          </Col>
          <Col span={12}>
            <DisasterLoanBudgetPie />
          </Col>
        </Row>
      </StyledDashboard>
    );
  }
}

export default Dashboard;
