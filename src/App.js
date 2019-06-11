import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import { Icon, Layout, Menu, Breadcrumb } from 'antd';
import HeaderTitle from "./components/HeaderTitle";
import NavigationSider from "./components/NavigationSider";
const { Content, Footer } = Layout;
import routes from "routes.js";
import "./globalStyles.css";
const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      return (
        <Route
          exact
          path={prop.path}
          component={prop.component}
          key={key}
        />
      );
    })}
  </Switch>
);
class App extends React.Component {
  state = {
    collapsed: false,
  };

  handleOnCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    return (
      <Layout>
        <NavigationSider collapsed={this.state.collapsed} routes={routes} curRoute={this.props.location.pathname} />
        <Layout>
          <HeaderTitle collapsed={this.state.collapsed} handleOnCollapse={this.handleOnCollapse} />
          <Content style={{ margin: '0 16px' }}>
            {switchRoutes}
          </Content>
          <Footer style={{ textAlign: 'center', paddingBottom: "10px" }}>
            Continuous Intelligence ©2019
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default withRouter(App);
