import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import { Icon, Layout, Menu, Breadcrumb } from 'antd';
import HeaderTitle from "./components/HeaderTitle";
import NavigationHeader from "./components/NavigationHeader";
const { Header, Content, Footer } = Layout;
import routes from "routes.js";
import "./globalStyles.css";
const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      return (
        <Route
          exact
          path={prop.subPath ? prop.path+prop.subPath : prop.path}
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
      <Layout className="layout">
        <NavigationHeader collapsed={this.state.collapsed} routes={routes} curRoute={this.props.location.pathname} />
        <Content style={{ padding: '0 25px' }}>
          {switchRoutes}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Continuous Intelligence ©2019
        </Footer>
      </Layout>
    )
  }
}

export default withRouter(App);
