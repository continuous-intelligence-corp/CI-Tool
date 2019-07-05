// core components/views
import Dashboard from "views/Dashboard.js";
import Charts from "views/Charts.js";
import Pipelines from "views/Pipelines.js";


const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "dashboard",
    component: Dashboard,
  },
  {
    path: "/charts",
    name: "Charts",
    icon: "bar-chart",
    component: Charts,
    hasChildren: true
  },
  {
    path: "/charts",
    subPath: "/budgetdrawdown",
    name: "Budget Drawdown",
    icon: "box-plot",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/disasterloan",
    name: "Disaster Loan",
    icon: "area-chart",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/incometracker",
    name: "Income Tracker",
    icon: "line-chart",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/regionalbudget",
    name: "Regional Budget",
    icon: "global",
    component: Charts,
  },
  {
    path: "/pipelines",
    name: "Pipelines",
    icon: "sliders",
    component: Pipelines,
  }
];

export default routes;
