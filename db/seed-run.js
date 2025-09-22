const seed = require("./seed");
const { propertyTypesData } = require("./data/test")
const db = require("./connection.js");

seed(propertyTypesData).then(() => {
    db.end();
});