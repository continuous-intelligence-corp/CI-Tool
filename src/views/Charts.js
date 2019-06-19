import React from "react";
import { Row, Col } from 'antd';
import ChartController from "../components/ChartController";
class Charts extends React.Component {
  render() {
    return (
      <div>
          <Col span={18}>
            col-6 col-pull-18
          </Col>
          <Col span={6}>
            <ChartController />
          </Col>
      </div>
    );
  }
}

export default Charts;
