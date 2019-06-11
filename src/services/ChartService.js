// https://cors-anywhere.herokuapp.com/ -> MiddleWare - add it to begging of URL to get around CORS
// fetch(
//     "http://ec2-18-211-174-221.compute-1.amazonaws.com:18082/druid/v2",
//     {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       //mode: 'cors', // no-cors, cors, *same-origin
//       headers: {
//           'Content-Type': 'application/json',
//           // 'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: JSON.stringify(data), // body data type must match "Content-Type" header
//     },
//   )
//   .then(function(response) {
//     console.log("response", response);
//     // The response is a Response instance.
//     // You parse the data into a useable format using `.json()`
//     return response.json();
//   }).then(function(data) {
//     // `data` is the parsed version of the JSON returned from the above endpoint.
//     console.log("MY CHART DATA", data);
//   });
const DRUID_URL = "http://ec2-18-211-174-221.compute-1.amazonaws.com:18082/druid/v2"
const CI_BACKEND_URL = "http://localhost:3000";
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
      DRUID_URL,
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
      console.log("MY CHART DATA", data);
      resolve(data);
    });
  });
}
