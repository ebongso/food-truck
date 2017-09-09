const colors  = require('colors');
const request = require('request');
const tab     = require('tab');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const foodTruckAPI = 'http://data.sfgov.org/resource/bbb8-hzi6.json';
const foodTruckAPIKey = 'p8SRi9hsBHOdVroAo8P1aetKY';

//Construct the querystring for the food truck API
let constructQueryString = (dayInString, hourIn24, sortBy, limit, page) => {
  return `?$$app_token=${ foodTruckAPIKey }&dayofweekstr=${ dayInString }&start24=${ hourIn24 }:00` + 
    `&$order=${ sortBy }&$limit=${ limit }&$offset=${ (limit * page) - limit }`;
};

let makeAPIRequest = (now, sortBy, limit, page) => {
  //Two ways to approach this:
  //1. Make 1 API request to get all results (could be slow if it returns a large dataset)
  //2. Make multiple API requests until all results are obtained (could be too many requests to the server)
  request(`${ foodTruckAPI }${ constructQueryString(days[now.getDay()], now.getHours(), sortBy, limit, page) }`, (error, response, body) => {
    try {
      if(error) { //if there's an error, log it and return
        console.error(error);
        return;
      }

      //Make sure the response is successful
      if(response && response.statusCode === 200 && body) {
        const foodTrucks = JSON.parse(body); //result is returned as a string, so need to parse it
        if(foodTrucks.length > 0) {
          display(foodTrucks, page);
          return makeAPIRequest(now, sortBy, limit, page + 1);
        }
      } else { //Something is wrong with the request
        console.error(response.body);
      }
    } catch(ex) {
      console.error(ex);
    }
  });
};

//Display food trucks in a table
let display = (foodTrucks, page) => {
  try {
    let rows = [];
    for(let foodTruck of foodTrucks) {
      rows.push({ 'NAME': foodTruck.applicant, 'ADDRESS': foodTruck.location });
    }

    console.log();
    console.log(colors.underline.cyan(`Page ${ page }`)); //Underline the page number display with cyan color
    //Create a table with specific width so that food trucks's info is displayed nicely
    tab.emitTable({
      'columns': [{
          'label': 'NAME',
          'width': 40
        }, {
          'label': 'ADDRESS'
        }],
      'rows': rows
    });
  } catch(ex) {
    console.error(ex);
  }
};

(() => {
  console.log(colors.rainbow('One moment please...'));

  //Display up to 10 food trucks at a time and sort the output alphabetically by name
  makeAPIRequest(new Date(), 'applicant ASC', 10, 1);
})();