const seed = require("./seed");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
} = require("./data");
const db = require("./connection.js");

seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData, favouritesData).then(
  () => {
    db.end();
  }
);
