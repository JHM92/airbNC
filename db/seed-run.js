const seed = require("./seed");
const db = require("./connection.js");

seed().then(() => {
    db.end();
});