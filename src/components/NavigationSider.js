import React from "react";
import { Layout, Menu, Icon } from "antd";
import ciLogo2 from "../assets/ciLogo2.png";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Sider } = Layout;

const NavigationSiderWithStyles = styled(Sider)`

.logo {
  background: #002040;
  height: 64px;
  display: flex;
  .logo-wrapper {
    display: flex;
    justify-items: center;
    align-items: center;
    padding: 15px;
    img {
      height: 48px;
      width: 48px;
    }
  }

  h1 {
    color: #fff;
    line-height: 20px;
    display: inline-block;
    margin: 12px 0 0 12px;
    font-weight: 400;
    font-size: 16px;
    vertical-align: top;
  }
}
`;

/*
<div className="logo">
  <img src={ciLogo} alt={"logo"}/>
  {!this.state.collapsed && (
    <h1>Continuous <br /> Intelligence</h1>
  )}
</div>
*/
class NavigationSider extends React.Component {
  render() {
    const { curRoute, routes } = this.props;
    return (
      <NavigationSiderWithStyles
        trigger={null}
        collapsible
        collapsed={this.props.collapsed}
        >
          <div className="logo">
            <div className="logo-wrapper">
              <img src={ciLogo2} alt={"logo"}/>
            </div>
            {!this.props.collapsed && (
              <h1>Continuous <br /> Intelligence</h1>
            )}
          </div>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[curRoute]}
            style={{ lineHeight: '64px' }}
          >
            {routes.map((route, routeIndex) => (
              <Menu.Item key={route.path}>
                <Link to={route.path}>
                  <Icon type={route.icon} />
                  <span className="nav-text">
                    {route.name}
                  </span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </NavigationSiderWithStyles>
    )
  }
}

export default NavigationSider;
