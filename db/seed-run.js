const seed = require("./seed");
const { propertyTypesData, usersData, propertiesData } = require("./data/test")
const db = require("./connection.js");

seed(propertyTypesData, usersData, propertiesData).then(() => {
    db.end();
});