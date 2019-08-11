// const DRUID_URL = "http://ec2-18-211-174-221.compute-1.amazonaws.com:18082/druid/v2"
// curl -X GET "http://3.221.2.243:3000/property"
// Local
// const CI_BACKEND_URL = "http://localhost:3000";
// Production
const CI_BACKEND_URL = "http://3.221.2.243:3000";

const DRUID_URL = `${CI_BACKEND_URL}/druid/v2`;
export var DRUID_DATA_SOURCE = "transaction2";
export var CHART_POLL_TIMER = 10000;
export var CHART_HEIGHT_PERCENTAGE = "40%";
export const DISASTER_LOAN_PROGRAM_CODE = "028-017";
export function fetchOffices(){
  return new Promise((resolve, reject) => {
    fetch(`${CI_BACKEND_URL}/offices`)
    .then(function(response) {
      return response.json();
    })
    .then(function(offices) {
      resolve(offices);
    });
  });

}

export function fetchPrograms(){
  return new Promise((resolve, reject) => {
    fetch(`${CI_BACKEND_URL}/programs`)
    .then(function(response) {
      return response.json();
    })
    .then(function(programs) {
      resolve(programs);
    });
  });
}


export function fetchDruidData(params){
  return new Promise((resolve, reject) => {
    fetch(
      `${DRUID_URL}`,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      },
    )
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      resolve(data);
    });
  });
}

export function fetchProperties(){
  return new Promise((resolve, reject) => {
    fetch(`${CI_BACKEND_URL}/property`)
    .then(function(response) {
      return response.json();
    })
    .then(function(property) {
      if (property && property[0] && property[0].value) {
        CHART_POLL_TIMER = property[0].value * 1000 || 10000;
      }
      resolve(property);
    });
  });
}

export function setProperty(keyValuePair){
  return new Promise((resolve, reject) => {
    let updateKey = "";
    let updateValue = "";
    if (keyValuePair && keyValuePair.hasOwnProperty("dataGenInterval")) {
      updateKey = "datagen_interval";
      updateValue = keyValuePair.dataGenInterval;
    } else if (keyValuePair && keyValuePair.hasOwnProperty("avgTransactionAmt")) {
      updateKey = "avg_award";
      updateValue = keyValuePair.avgTransactionAmt;
    } else {
      reject("ERROR FAILED TO FIND PROPERTY IN ", keyValuePair);
      return null;
    }
    fetch(`${CI_BACKEND_URL}/property`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ [updateKey]: updateValue }),
    })
    .then(function(response) {
      if (keyValuePair && keyValuePair.hasOwnProperty("dataGenInterval")) {
        CHART_POLL_TIMER = keyValuePair.dataGenInterval * 1000;
      }
      return response.json();
    })
    .then(function(property) {
      resolve(property);
    });
  });
}


export function setDruidDataSource(value){
  return new Promise((resolve, reject) => {
    DRUID_DATA_SOURCE = value;
    resolve();
  });
}


export function setDruidDataSourceForQuery(druidQueryParams) {
  druidQueryParams.dataSource = DRUID_DATA_SOURCE;
}

export function setChartHeightPercentage(value) {
  console.log("value", value);
  if (value.length > 3 || value.indexOf("%") !== value.length - 1) {
    CHART_HEIGHT_PERCENTAGE = "40%";
  } else {
    CHART_HEIGHT_PERCENTAGE = value;
  }
}
