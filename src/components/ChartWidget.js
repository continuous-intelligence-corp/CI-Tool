import React from "react";
import { Card, Divider } from "antd";
import styled from "styled-components";

const StyedChartWidget = styled(Card)`
  h1 {
    font-size: 16px;
    color: #989898;
    font-weight: 200;
  }
  .top-section {
    height: 75%;
  }
`;
class ChartWidget extends React.Component {

  render() {
    return (
      <StyedChartWidget>
        <div className="top-section">
          <h1>{this.props.title}</h1>
          {this.props.children && this.props.children}
        </div>
        <Divider style={{margin: "24px 0 10px 0"}}/>
        {this.props.bottom && this.props.bottom}
      </StyedChartWidget>
    );
  }
}

export default ChartWidget
