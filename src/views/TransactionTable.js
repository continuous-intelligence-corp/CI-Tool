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
  height: 90vh;
  overflow: scroll;
`;

var druidQueryParams = {
    "queryType": "scan",
    "dataSource": DRUID_DATA_SOURCE,
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

    if (this.props.filters !== prevProps.filters) {
      let chartName = "";
      let filters = {};
      let filterProgram = null;
      let filterOffice = null;
      const { programCode, officeId, timeRange } = this.props.filters;
      let transactionTitle = "Transactions";
      if (this.props.filters.programCode) {
        this.props.programs.map(program => {
          if (program.code === this.props.filters.programCode) {
            chartName = `${program.name} ${transactionTitle} By Office`;
            filterProgram = program;
          }
        });
        filters = {
          filter: {
            type: "selector",
            dimension: "program_code",
            value: `${filterProgram.code}`
          }
        };
      } else {
        chartName = `Regional ${transactionTitle} By Office`;
      }
      if (officeId) {
        this.props.offices.map(office => {
          if (office.id === officeId) {
            chartName += ` ${office.name}`;
            filterOffice = office;
          }
        });
        if (filters.filter) {
          filters.filter = {
            type: "and",
            fields: [
              {
                type: "selector",
                dimension: "program_code",
                value: `${filterProgram.code}`
              },
              {
                type: "selector",
                dimension: "office_id",
                value: `${filterOffice.id}`
              }
            ],
          }
        } else {
          filters.filter = {
            type: "selector",
            dimension: "office_id",
            value: `${filterOffice.id}`
          };
        }
      }

      if (timeRange) {
        filters.intervals = `${timeRange[0].format()}/${timeRange[1].format()}`;
      } else {
        filters.intervals = null;
      }
      this.setState({
        filters,
      }, () => {
        this.fetchTransactions();
      });
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
    if (!queryParams.intervals) {
      this.setTimeIntervals(queryParams);
    }
    console.log("queryParams", queryParams);
    fetchDruidData(queryParams).then(druidData => {
      let data = this.processDruidResults(druidData);
      this.setState({ data });
    });
  }
  render() {
    const { data } = this.state;
    return (
      <StyledCard title="Transaction Table">
        <Table columns={columns} dataSource={data} />
      </StyledCard>
    );
  }
}

export default TransactionTable;
