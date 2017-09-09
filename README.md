##### package.json file is included. Please run 'npm install' to install dependencies.

##### To run the program, run 'node FoodTruckFinder.js'.

##### To build this as a full-scale web application:
I would use local storage to cache the food truck data if it doesn't change often. It would be nice if the API response would return the total number of food trucks, so we could refresh the cache when there's an update. But, we can check for new food trucks based on the date food trucks are added. Also, knowing the total number of food trucks would make it easier to show pagination. I would want to let users sort the output (by closing time, new food trucks, location, type of cuisine, etc.), change the number of food trucks per page, and search food trucks by name. I would also want to integrate with Yelp to pull in reviews for the food trucks.