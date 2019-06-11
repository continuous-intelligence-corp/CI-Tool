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
  },
  {
    path: "/pipelines",
    name: "Pipelines",
    icon: "sliders",
    component: Pipelines,
  }
];

export default routes;
