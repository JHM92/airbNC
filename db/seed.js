const db = require("./connection.js");

async function seed() {

    await db.query(`DROP TABLE IF EXISTS property_types`);

    await db.query(`CREATE TABLE property_types (
        property_type VARCHAR(40) NOT NULL PRIMARY KEY,
        description TEXT NOT NULL
        );`);

}

module.exports = seed;