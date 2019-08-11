import React from "react";
import { Avatar, Badge, Dropdown, Layout, Icon, Menu, Tooltip } from 'antd';
import ciLogo3 from "../assets/ciLogo3.png";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Header } = Layout;
const { SubMenu } = Menu;
const NavigationHeaderWithStyles = styled(Header)`

  display: flex;
  justify-content: space-between;
  .left-container {
    display: flex;
  }
  .logo {
    width: 200px;
    height: 64px;
    display: flex;
    .logo-wrapper {
      display: flex;
      justify-items: center;
      align-items: center;
      padding: 15px;
      img {
        height: 60px;
        width: 60px;
      }
    }

    h1 {
      color: #E0E0E3;
      line-height: 20px;
      display: inline-block;
      margin: 12px 0 0 12px;
      font-weight: 400;
      font-size: 16px;
      vertical-align: top;
    }
  }
  .right-icons-section {
    color: #E0E0E3;
    display: flex;
    justify-content: flex-end;
    svg {
      color: #E0E0E3;
    }
    .ant-select {
      display: flex;
      justify-content: center;
      align-items: center;
      .ant-select-selection {
        background: #CCCCCC;
      }
    }
    .right-icon-selection {
      display: inline-block;
      height: 100%;
      padding: 0 12px;
      cursor: pointer;
      transition: all .3s;
    }
    .right-icon-selection:hover {
      background: #1890FF;
      cursor: pointer;
      svg {
        color: #E0E0E3;
      }
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
/*
<div className="logo">
  <img src={ciLogo} alt={"logo"}/>
  {!this.state.collapsed && (
    <h1>Continuous <br /> Intelligence</h1>
  )}
</div>
*/
class NavigationHeader extends React.Component {

  render() {
    const { curRoute, routes } = this.props;
    return (
      <NavigationHeaderWithStyles
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
      >
        <div className="left-container">
          <div className="logo">
            <div className="logo-wrapper">
              <img src={ciLogo3} alt={"logo"}/>
            </div>
            {!this.props.collapsed && (
              <h1>Continuous <br /> Intelligence</h1>
            )}
          </div>
          <Menu
            mode="inline"
            theme="dark"
            mode="horizontal"
            selectedKeys={[curRoute]}
            style={{ lineHeight: '64px' }}
          >
            {routes.map((route, routeIndex) => {
              if (route.subPath) return null;
              if (route.hasChildren) {
                return (
                  <SubMenu
                    title={
                      <span className="submenu-title-wrapper">
                        <Icon type={route.icon} />
                        {route.name}
                      </span>
                    }
                  >
                    <Menu.ItemGroup title={null}>
                    {routes.map((subRoute, subRouteIndex) => {
                      if (!subRoute.subPath || subRoute.path !== route.path) return null;
                      return (
                        <Menu.Item key={subRouteIndex}>
                          <Link to={subRoute.path+subRoute.subPath}>
                            <Icon type={subRoute.icon} />
                            <span className="nav-text">
                              {subRoute.name}
                            </span>
                          </Link>
                        </Menu.Item>
                      )
                    })}
                    </Menu.ItemGroup>
                  </SubMenu>
                )
              }
            return (
              <Menu.Item key={route.path}>
                <Link to={route.path}>
                  <Icon type={route.icon} />
                  <span className="nav-text">
                    {route.name}
                  </span>
                </Link>
              </Menu.Item>
            );
          })}
          </Menu>
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
              <Badge count={5} style={{ top: "-4px" }}>
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
        </NavigationHeaderWithStyles>
    )
  }
}

export default NavigationHeader;
