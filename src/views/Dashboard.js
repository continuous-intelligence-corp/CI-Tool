import React, { Component, Suspense } from 'react';
import { Row, Col, Icon, Menu, Dropdown, Card } from 'antd';
import ChartWidget from "../components/ChartWidget.js";
import styled from "styled-components";
import BudgetDrawdown from "../charts/BudgetDrawdown.js";
import IncomeTracker from "../charts/IncomeTracker.js";
import DisasterLoan from "../charts/DisasterLoan.js";
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
        dataSource: "transaction",
        intervals: ["2019-05-20/2019-06-05"],
        granularity: "day",
};
class Dashboard extends Component {
  render() {
    return (
      <StyledDashboard>
        <Row gutter={16}>
          <Col span={6}>
            <ChartWidget
              title="Total Revenue"
              bottom={
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h2 style={{ fontSize: "14px" }}>Avg Monthly Revenue</h2>
                  <p>$2,770</p>
                </div>
              }
            >
              <div>
                <div>
                  <h2 style={{fontSize: "24px"}}>
                    $33,280
                  </h2>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", height: "20px" }}>
                  <h6>YoY Percent Increase</h6><p> 12%</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", height: "5px" }}>
                  <h6>Units Sold</h6><p> 2,630</p>
                </div>
              </div>
            </ChartWidget>
          </Col>
          <Col span={6}><div>Second Chart</div></Col>
          <Col span={6}><div>Third Chart</div></Col>
          <Col span={6}><div>Fourth Chart</div></Col>
        </Row>
        <Row>
          <Col span={24}>
            <BudgetDrawdown />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <IncomeTracker />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <RegionalBudget />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DisasterLoan />
          </Col>
        </Row>
      </StyledDashboard>
    );
  }
}

export default Dashboard;
