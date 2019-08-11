import React, { Fragment } from "react";
import { Row, Col, Drawer, Icon } from 'antd';
import ChartController from "../components/ChartController";
import { fetchOffices, fetchPrograms, fetchDruidData } from "../services/ChartService.js";
import BudgetDrawdown from "../charts/BudgetDrawdown";
import IncomeTracker from "../charts/IncomeTracker";
import TransactionTracker from "../charts/TransactionTracker";
import OfficeComparison from "../charts/OfficeComparison";
import RegionalBudget from "../charts/RegionalBudget";
import RegionalTransaction from "../charts/RegionalTransaction";
import TransactionTable from "./TransactionTable";
import styled from "styled-components";

const StyledCharts = styled.div`
  .ant-row {
    margin-top: 25px;
  }

  .ant-card-body {
    /* background: #353537; */
  }

  .chart-controller-icon {
    position: absolute;
    z-index: 1000;
    left: 97%;
    top: 2%;
    color: #CCCCCC;
    svg {
      height: 35px;
      width: 35px;
    }
  }
`;
class Charts extends React.Component {
  state = {
    offices: [],
    programs: [],
    filters: {},
    visible: false,
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

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
        return <BudgetDrawdown offices={offices} programs={programs} filters={filters} height={"38%"} />;
      case "/charts/incometracker":
        return <IncomeTracker programs={programs} offices={offices} filters={filters} height={"38%"} />;
      case "/charts/regionalcomparison":
        return <OfficeComparison programs={programs} offices={offices} filters={filters} height={"38%"} />;
      case "/charts/transactionTracker":
        return <TransactionTracker programs={programs} offices={offices} filters={filters} height={"38%"} />;
      case "/charts/regionalbudget":
        return <RegionalBudget programs={programs} filters={filters} height={"38%"} />;
      case "/charts/regionaltransaction":
        return <RegionalTransaction programs={programs} offices={offices} filters={filters} height={"38%"} />;
      case "/charts/transactiontable":
        return <TransactionTable programs={programs} offices={offices} filters={filters} height={"38%"} />;
      default:
        return null;
    }

  }
  render() {
    const { offices, programs } = this.state;
    //  ? ( NO CHART CONTROLLER
    return (
      <StyledCharts>
        {this.props.location.pathname !== "/charts/transactionTracker" && (
          <Icon type="menu-fold" onClick={this.showDrawer} className="chart-controller-icon"/>
        )}
        <Row gutter={24}>
          <Col span={24}>
            {this.renderChart()}
          </Col>
        </Row>
        <Drawer
          title="Chart Controls"
          placement="right"
          closable={false}
          onClose={this.onClose}
          width={300}
          visible={this.state.visible}
        >
          <ChartController
            chartRoute={this.props.location.pathname}
            offices={offices}
            programs={programs}
            handleSetFilters={this.handleSetFilters}
          />
        </Drawer>
      </StyledCharts>
    );
  }
}

export default Charts;
