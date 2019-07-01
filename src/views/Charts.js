import React from "react";
import { Row, Col } from 'antd';
import ChartController from "../components/ChartController";
import { fetchOffices, fetchPrograms, fetchDruidData } from "../services/ChartService.js";

class Charts extends React.Component {
  state = {
    offices: [],
    programs: [],
  }

  componentDidMount() {
    fetchPrograms().then(programs => {
      this.setState({ programs });
    });
    fetchOffices().then(offices => {
      this.setState({ offices });
    });
  }
  render() {
    const { offices, programs } = this.state;
    return (
      <div>
          <Col span={18}>
            col-6 col-pull-18
          </Col>
          <Col span={6}>
            <ChartController offices={offices} programs={programs} />
          </Col>
      </div>
    );
  }
}

export default Charts;
