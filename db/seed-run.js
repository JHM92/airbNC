const seed = require("./seed");
const {
  propertyTypesData,
  usersData,
  propertiesData,
  reviewsData,
  imagesData,
} = require("./data/test");
const db = require("./connection.js");

seed(propertyTypesData, usersData, propertiesData, reviewsData, imagesData).then(() => {
  db.end();
});
