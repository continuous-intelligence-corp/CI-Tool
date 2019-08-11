import React from "react";
import { Card, Select, Form, Input } from 'antd';
import styled from "styled-components";


import { DRUID_DATA_SOURCE, CHART_HEIGHT_PERCENTAGE, setChartHeightPercentage, setDruidDataSource, fetchProperties, setProperty } from "../services/ChartService.js";
const { Search } = Input;

const StyledPipeline = styled(Card)`
  background: #fff;
  padding: 50px;
  margin: 50px 25px !important;
  .ant-select {
    width: 150px !important;
  }
`;
class Pipelines extends React.Component {

  state = {
    dataGenInterval: null,
    druidDataSource: null,
    avgTransactionAmt: null,
    chartHeightPercentage: null,
  }

  updateDataGenValue = (value) => {
    setProperty({dataGenInterval: value}).then((response) => {
      if (response && response.message && response.message.includes("successfully")) {
        this.setDataValue({dataGenInterval: value});
      }
    });
  }
  updateDruidDataSource = (value) => {
    setDruidDataSource(value).then(() => {
      this.setDataValue({ druidDataSource: value});
    });
  }
  updateAvgTransactionAmtValue = (value) => {
    setProperty({avgTransactionAmt: value}).then((response) => {
      if (response && response.message && response.message.includes("successfully")) {
        this.setDataValue({avgTransactionAmt: value});
      }
    });
  }

  setDataValue = (newState) => {
    if (newState) {
      this.setState({...this.state, ...newState});
    }
  }

  changeChartHeightValue = event => {
    this.setState({ chartHeightPercentage: event.target.value });
  }

  componentDidMount() {
    fetchProperties().then(properties => {
      let value = properties && properties[0] && properties[0].value;
      this.setDataValue({
        dataGenInterval: properties && properties[0] && properties[0].value,
        avgTransactionAmt: properties && properties[1] && properties[1].value,
        druidDataSource: DRUID_DATA_SOURCE,
        chartHeightPercentage: CHART_HEIGHT_PERCENTAGE,
      });
    });
  }
  render() {
    const { dataGenInterval, druidDataSource, avgTransactionAmt } = this.state;
    return (
      <StyledPipeline title="Settings">
        <Form>
          <Form.Item label="Datasource">
            <Select value={druidDataSource} style={{ width: 120 }} onChange={this.updateDruidDataSource}>
              <Option value="transaction2">transaction2</Option>
              <Option value="transaction3">transaction3</Option>
              <Option value="transaction4">transaction4</Option>
              <Option value="transaction5">transaction5</Option>
              <Option value="transaction6">transaction6</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Data Generator Interval">
            <Select value={dataGenInterval} style={{ width: 120 }} onChange={this.updateDataGenValue}>
              <Option value="0">0</Option>
              <Option value="1">1</Option>
              <Option value="5">5</Option>
              <Option value="10">10</Option>
              <Option value="30">30</Option>
              <Option value="60">60</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Average Transaction Amount">
            <Select value={avgTransactionAmt} style={{ width: 120 }} onChange={this.updateAvgTransactionAmtValue}>
              <Option value="100000">100,000</Option>
              <Option value="1000000">1,000,000</Option>
              <Option value="5000000">5,000,000</Option>
              <Option value="10000000">10,000,000</Option>
              <Option value="25000000">25,000,000</Option>
              <Option value="50000000">50,000,000</Option>
              <Option value="75000000">75,000,000</Option>
              <Option value="100000000">100,000,000</Option>

            </Select>
          </Form.Item>
        </Form>
      </StyledPipeline>
    );
  }
}

export default Pipelines;

/*
<Form.Item label="Chart Height Percentage">
  <Search
    placeholder="input height"
    enterButton="Set"
    style={{width: "200px"}}
    value={this.state.chartHeightPercentage}
    onChange={this.changeChartHeightValue}
    onSearch={value => {
      setChartHeightPercentage(this.state.chartHeightPercentage);
      this.setState({ chartHeightPercentage: CHART_HEIGHT_PERCENTAGE });
    }}
  />
</Form.Item>
 */
