const db = require("./connection.js");
const format = require("pg-format");

async function seed(property_types) {

    // drop tables
    await db.query(`DROP TABLE IF EXISTS property_types`);


    //create property_types table
    await db.query(`CREATE TABLE property_types (
        property_type VARCHAR(40) NOT NULL PRIMARY KEY,
        description TEXT NOT NULL
        );`);

   

    // Insert data into property_types table
    await db.query(format(`INSERT INTO property_types (property_type, description) VALUES %L`,
    property_types.map(({property_type, description}) => [property_type, description])));
}
 
module.exports = seed;