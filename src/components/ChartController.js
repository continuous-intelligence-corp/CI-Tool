import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Select, DatePicker } from 'antd';
import styled from "styled-components";
import moment from "moment";

const StyledChartControler = styled(Form)`
  background: white;
  padding: 25px !important;
  height: 550px;
  border: 1px solid rgb(232, 232, 232);
`;
const { Option } = Select;
const { RangePicker } = DatePicker;

class ChartForm extends Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.props.handleSetFilters) {
          this.props.handleSetFilters(values);
        }
      }
    });
  };
  handleReset = e => {
    e.preventDefault();
    this.props.form.resetFields();
  }
  disabledDate = (current, type) => {
    // Can not select days before today and today
    return current && (current > moment().endOf('year') || current < moment('2019').endOf('year'));
  }

  renderActions = () => {
    return (
      <Form.Item>
        <Button style={{ float: "left" }} onClick={this.handleReset}>
          Clear
        </Button>
        <Button style={{ float: "right" }} type="primary" htmlType="submit" className="submit-form-button">
          Submit
        </Button>
      </Form.Item>
    )
  }

  renderBudgetDrawdownOptions = () => {
    const { form, offices, programs } = this.props;
    const { getFieldDecorator } = form;
    return (
      <StyledChartControler onSubmit={this.handleSubmit} className="login-form">

        <Form.Item label="Office">
          {getFieldDecorator('officeId', {
            rules: [],
          })(
            <Select placeholder="Office">
              {offices && offices.map(office => (
                <Option value={office.id}>{office.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        {this.renderActions()}
      </StyledChartControler>
    );
  }

  renderRegionalBudgetOptions = () => {
    const { form, offices, programs } = this.props;
    const { getFieldDecorator } = form;
    return (
      <StyledChartControler onSubmit={this.handleSubmit} className="login-form">

        <Form.Item label="Office">
          {getFieldDecorator('officeId', {
            rules: [],
          })(
            <Select placeholder="Office">
              {offices && offices.map(office => (
                <Option value={office.id}>{office.name}</Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        {this.renderActions()}
      </StyledChartControler>
    );
  }

  render() {
    const { chartRoute } = this.props;

    switch(chartRoute) {
      case "/charts/budgetdrawdown":
        return this.renderBudgetDrawdownOptions();
      // case "/charts/disasterloan":
      //   return this.renderDisasterLoanOptions();
      case "/charts/incometracker":
        return this.renderRegionalBudgetOptions();
      case "/charts/regionalbudget":
        return this.renderRegionalBudgetOptions();
      default:
        return null;
    }
  }
}
const ChartController = Form.create({ name: 'chart_controls' })(ChartForm);

export default ChartController;

/*
<StyledChartControler onSubmit={this.handleSubmit} className="login-form">
  <Form.Item label="Chart Type" hasFeedback>
    {getFieldDecorator('chart-type', {
      rules: [{ required: true, message: 'Please select a chart type!' }],
    })(
      <Select placeholder="Please select a chart type">
        <Option value="area">Area</Option>
        <Option value="bar">Bar</Option>
        <Option value="column">Column</Option>
        <Option value="line">Line</Option>
      </Select>,
    )}
  </Form.Item>

  <Form.Item label="Offices">
    {getFieldDecorator('officeIds', {
      rules: [
        { required: true, message: 'Please select Offices to filter by!', type: 'array' },
      ],
    })(
      <Select mode="multiple" placeholder="Please select Offices to filter by">
        {offices && offices.map(office => (
          <Option value={office.id}>{office.name}</Option>
        ))}
      </Select>,
    )}
  </Form.Item>

  <Form.Item label="Programs">
    {getFieldDecorator('programIds', {
      rules: [
        { required: true, message: 'Please select Programs to filter by!', type: 'array' },
      ],
    })(
      <Select mode="multiple" placeholder="Please select Programs to filter by">
        {programs && programs.map(program => (
          <Option value={program.code}>{program.name}</Option>
        ))}
      </Select>,
    )}
  </Form.Item>

  <Form.Item label="Pick Dates">
    {getFieldDecorator('date', {
      rules: [{ type: 'array', required: true, message: 'Please select time!' }],
    })(
      <RangePicker disabledDate={this.disabledDate} />
    )}
  </Form.Item>


  <Form.Item>
    <Button style={{ float: "right" }}type="primary" htmlType="submit" className="submit-form-button">
      Submit
    </Button>
  </Form.Item>
</StyledChartControler>
 */
