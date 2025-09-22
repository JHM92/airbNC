const db = require("./connection.js");
const format = require("pg-format");

async function seed(property_types, users) {

    // drop tables
    await db.query(`DROP TABLE IF EXISTS property_types;`);
    await db.query(`DROP TABLE IF EXISTS users;`);


    //create property_types table
    await db.query(`CREATE TABLE property_types (
        property_type VARCHAR(40) NOT NULL PRIMARY KEY,
        description TEXT NOT NULL
        );`);

    await db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(40) NOT NULL,
        surname VARCHAR(40) NOT NULL,
        email VARCHAR(40) NOT NULL,
        phone_number VARCHAR(15),
        is_host BOOLEAN NOT NULL,
        avatar VARCHAR(40),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );`);

   

    // Insert data into property_types table
    await db.query(format(`INSERT INTO property_types (property_type, description) VALUES %L`,
    property_types.map(({property_type, description}) => [property_type, description])));

    // Insert data into users table
    await db.query(format(`INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`,
    users.map(({first_name, surname, email, phone_number, is_host, avatar}) => 
               [first_name, surname, email, phone_number, is_host, avatar])    
    ));
}
 
module.exports = seed;