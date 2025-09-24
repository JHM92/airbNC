const seed = require("./seed");
const { propertyTypesData, usersData, propertiesData, reviewsData } = require("./data/test");
const db = require("./connection.js");

seed(propertyTypesData, usersData, propertiesData, reviewsData).then(() => {
  db.end();
});
