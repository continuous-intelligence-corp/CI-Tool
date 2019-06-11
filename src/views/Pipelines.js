import React from "react";
import { Card, Table, Divider, Tag, Icon } from 'antd';
import styled from "styled-components";
const columns = [
{
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  render: text => <Icon type={text === "done" ? "check-circle" : "close-circle"} style={{ color: text === "done" ? "green" : "red"}} />,
}, {
  title: 'Pipeline Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <h4 style={{color: "#262626"}}>{text}</h4>
}, {
  title: 'URL',
  dataIndex: 'url',
  key: 'url',
  render: text => <p style={{color: "#B7B7B7"}}>{text}</p>
}, {
  title: 'Actions',
  key: 'actions',
  dataIndex: 'actions',
  render: tags => (
    <span>
      {tags.map(tag => {
        let color = tag === "search" ? 'geekblue' : 'green';
        if (tag === 'email') {
          color = 'volcano';
        }
        return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
      })}
    </span>
  ),
}];

const data = [{
  key: '1',
  name: "Grants Dashboard",
  status: "done",
  url: "myCL->Charts->GrantsDrawdown",
  actions: ['download', 'search', 'email'],
}, {
  key: '2',
  name: "Loans Dashboard",
  status: "uhoh",
  url: "myCL->Charts->GrantsByRegion",
  actions: ['download', 'search', 'email'],
}, {
  key: '3',
  name: "Personnel Dashboard",
  status: "uhoh",
  url: "myCL->Charts->LoansDrawdown",
  actions: ['download', 'search', 'email'],
}];

const StyledPipeline = styled(Card)`
  background: #fff;
  padding: 50px;
  margin: 50px 25px !important;
  .ant-table-body {
    border: 1px solid #FAFAFA;
  }
`;
class Pipelines extends React.Component {
  render() {
    return (
      <StyledPipeline title="Pipelines">
        <Table columns={columns} dataSource={data} pagination={false} />
      </StyledPipeline>
    );
  }
}

export default Pipelines;
