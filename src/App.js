import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import { Icon, Layout, Menu, Breadcrumb } from 'antd';
import HeaderTitle from "./components/HeaderTitle";
import NavigationHeader from "./components/NavigationHeader";
const { Header, Content, Footer } = Layout;
import routes from "routes.js";
import "./globalStyles.css";

// Sand Signika
// Load the fonts
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Signika:400,700',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

// Add the background image to the container
Highcharts.addEvent(Highcharts.Chart, 'afterGetContainer', function () {
   this.container.style.background =
       'url(https://www.highcharts.com/samples/graphics/sand.png)';
});


Highcharts.theme = {
   colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee',
       '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
       backgroundColor: null,
       style: {
           fontFamily: 'Signika, serif'
       }
   },
   title: {
       style: {
           color: 'black',
           fontSize: '16px',
           fontWeight: 'bold'
       }
   },
   subtitle: {
       style: {
           color: 'black'
       }
   },
   tooltip: {
       borderWidth: 0
   },
   legend: {
       itemStyle: {
           fontWeight: 'bold',
           fontSize: '13px'
       }
   },
   xAxis: {
       labels: {
           style: {
               color: '#6e6e70'
           }
       }
   },
   yAxis: {
       labels: {
           style: {
               color: '#6e6e70'
           }
       }
   },
   plotOptions: {
       series: {
           shadow: true
       },
       candlestick: {
           lineColor: '#404048'
       },
       map: {
           shadow: false
       }
   },

   // Highstock specific
   navigator: {
       xAxis: {
           gridLineColor: '#D0D0D8'
       }
   },
   rangeSelector: {
       buttonTheme: {
           fill: 'white',
           stroke: '#C0C0C8',
           'stroke-width': 1,
           states: {
               select: {
                   fill: '#D0D0D8'
               }
           }
       }
   },
   scrollbar: {
       trackBorderColor: '#C0C0C8'
   },

   // General
   background2: '#E0E0E8'

};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);



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
