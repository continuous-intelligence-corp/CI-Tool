import React from "react";
let params = {
        queryType: "timeseries",
        dataSource: "transaction",
        intervals: ["2019-06-01/2019-06-04"],
        granularity: "day",
        threshold: 25,

};
class Charts extends React.Component {
  render() {
    return (
      <div>Charts!!!</div>
    );
  }
}

export default Charts;
