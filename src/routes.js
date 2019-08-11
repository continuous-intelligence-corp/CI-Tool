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
    subPath: "/transactionTracker",
    name: "Transaction Tracker",
    icon: "line-chart",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/transactiontable",
    name: "Transaction Table",
    icon: "table",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/regionalcomparison",
    name: "Regional Comparison",
    icon: "shop",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/regionaltransaction",
    name: "Regional Transactions",
    icon: "transaction",
    component: Charts,
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
    subPath: "/incometracker",
    name: "Budget vs Actuals",
    icon: "line-chart",
    component: Charts,
  },
  {
    path: "/charts",
    subPath: "/regionalbudget",
    name: "Budget Variance",
    icon: "global",
    component: Charts,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: "sliders",
    component: Pipelines,
  }
];

export default routes;
