import React from "react";
import { Card, Table, Divider, Tag, Icon, Select, Form } from 'antd';
import styled from "styled-components";
import _ from "lodash";
import { setDruidDataSourceForQuery, DRUID_DATA_SOURCE, CHART_POLL_TIMER, fetchOffices, fetchDruidData } from "../services/ChartService.js";

const {Option} = Select;
const columns = [
{
  title: 'Date',
  dataIndex: 'date',
  key: 'date',
  render: text => <h4 style={{color: "#262626"}}>{text}</h4>,
}, {
  title: 'Office',
  dataIndex: 'office',
  key: 'office',
  render: text => <h5 style={{color: "#262626"}}>{text}</h5>
}, {
  title: 'Program',
  dataIndex: 'program',
  key: 'program',
  render: text => <h5 style={{color: "#262626"}}>{text}</h5>
},{
  title: 'Commitment',
  dataIndex: 'commitment',
  key: 'commitment',
  render: text => <p>{text}</p>
}, {
  title: 'Jobs Created',
  key: 'jobs',
  dataIndex: 'jobs',
  render: text => <p style={{color: "#B7B7B7"}}>{text}</p>
}, {
  title: 'Risk Review',
  key: 'riskreview',
  dataIndex: 'riskreview',
  render: text => <p style={{color: "#B7B7B7"}}>{text}</p>
}];


const StyledCard = styled(Card)`
  background: #fff;
  height: 550px;
  overflow: scroll;
`;

var druidQueryParams = {
    "queryType": "scan",
    "dataSource": DRUID_DATA_SOURCE,
    "intervals": "2019-01-01T00:00:00+00:00/2019-12-31T00:00:00+00:00",
    "threshold": 10000,
};
class TransactionTable extends React.Component {
  state = {data: [], officeMap: {}, programMap: {}};
  setTimeIntervals = queryParams => {
    let now = new Date();
    let weekAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
    queryParams.intervals = `${weekAgo.toISOString()}/${now.toISOString()}`;
  }
  componentWillUnmount() {
    this.setState({ data: [], officeMap: {}, programMap: {} });
  }
  componentDidMount() {
    setDruidDataSourceForQuery(druidQueryParams);

    //this.fetchTransactions();
  }
  componentDidUpdate(prevProps) {
    if (this.props.offices !== prevProps.offices || this.props.programs !== prevProps.programs) {
      this.setDataMaps();
    }
  }

  setDataMaps = () => {
    let officeMap = {};
    let programMap = {};
    if (this.props.offices) {
      this.props.offices.map(office => {
        officeMap[office.id] = office.name;
      });
    }
    if (this.props.programs) {
      this.props.programs.map(program => {
        programMap[program.code] = program.name;
      });
    }
    this.setState({ officeMap, programMap }, () => {
      this.fetchTransactions();
    });
  }

  processDruidResults = druidData => {
    let results = [];
    druidData.map(druidRow => {
      if (druidRow.events && druidRow.events.length > 0) {
        druidRow.events.map(druidEvent => {
          let date = new Date(druidEvent.__time);
          let office = this.state.officeMap[druidEvent.office_id];
          let program = this.state.programMap[druidEvent.program_code];
          results.push({
            date: date.toLocaleString(),
            office,
            program,
            commitment: druidEvent.TotalSpent,
            jobs: druidEvent.jobsno || 0,
            riskreview: druidEvent.riskreview || 0,
          })
        })
      }
    });
    return results;
  }

  fetchTransactions = () => {
    const { filters } = this.state;
    let queryParams;
    if (filters) {
      queryParams = { ...druidQueryParams, ...filters };
    } else {
      queryParams = druidQueryParams;
    }
    this.setTimeIntervals(queryParams);
    fetchDruidData(queryParams).then(druidData => {
      let data = this.processDruidResults(druidData);
      this.setState({ data });
    });
  }
  render() {
    const { data } = this.state;
    return (
      <StyledCard>
        <Table columns={columns} dataSource={data} />
      </StyledCard>
    );
  }
}

export default TransactionTable;
