import React from "react";
import { Avatar, Badge, Dropdown, Layout, Icon, Menu, Tooltip } from 'antd';
import styled from "styled-components";
const { Header } = Layout;

const HeaderTitleWithStyles = styled(Header)`
  display: flex;
  justify-content: space-between;
  background: #fff !important;
  padding: 0 !important;

  .trigger-wrapper {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .trigger-wrapper:hover {
    background: #F9F9F9;
    cursor: pointer;
  }
  svg {
    font-size: 16px;
    color: #595959;
  }

  .left-header-section {
    display: flex;
    width: 75%;



    .ant-menu {
      .ant-menu-item, .ant-menu-submenu {
        border-bottom: 2px solid #41403E;
      }
      .ant-menu-item:hover, .ant-menu-submenu:hover, .ant-menu-item-active, .ant-menu-submenu-active, .ant-menu-item-open, .ant-menu-submenu-open, .ant-menu-item-selected, .ant-menu-submenu-selected {
        border-bottom: 2px solid #BE7634;
      }
      .ant-menu-item > a {
      }
      .ant-menu-item-selected > a, .ant-menu-item > a:hover {
      }
    }
  }

  .right-icons-section {
    width: 25%;
    display: flex;
    justify-content: flex-end;
    .ant-tool-open {
    }
    .right-icon-selection {
      display: inline-block;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
      transition: all .3s;
    }
    .right-icon-selection:hover {
      background: #F9F9F9;
      cursor: pointer;
    }
    .avatar-wrapper {
      width: auto;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding: 0 12px;
      span {
        padding: 0 5px;
      }
    }
  }
`;
const menu = (
    <Menu selectedKeys={[]}>
      <Menu.Item key="userCenter">
        <Icon type="user" />
        Account Center
      </Menu.Item>
      <Menu.Item key="userinfo">
        <Icon type="setting" />
        Account Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <Icon type="logout" />
        Logout
      </Menu.Item>
    </Menu>
  );
class HeaderTitle extends React.Component {

  render() {
    const { curRoute, routes } = this.props;
    return (
      <HeaderTitleWithStyles>
        <div className="trigger-wrapper" onClick={() => this.props.handleOnCollapse()}>
          <Icon
            className="trigger"
            type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
          />
        </div>
        <div className="right-icons-section">
          <Tooltip title="Search">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="right-icon-selection"
            >
              <Icon type="search" />
            </a>
          </Tooltip>
          <Tooltip title="Help">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="right-icon-selection"
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          <Tooltip title="Notifications">
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="right-icon-selection"
            >
            <Badge count={5}>
              <Icon type="bell" />
            </Badge>
            </a>
          </Tooltip>
          <Dropdown overlay={menu}>
            <div className="avatar-wrapper">
              <Avatar
                size="small"
                icon="user"
                alt="avatar"
              />
              <span>John Doe</span>
            </div>
          </Dropdown>
        </div>
      </HeaderTitleWithStyles>
    );
  }
}

export default HeaderTitle;
