const db = require("./connection.js");
const format = require("pg-format");
const dropTables = require("./queries/drops.js");
const { createUserRef, formatProperties } = require("./utils.js");

async function seed(property_types, users, properties) {
  await dropTables();

  // create property_types table
  await db.query(`CREATE TABLE property_types (
        property_type VARCHAR(40) NOT NULL PRIMARY KEY,
        description TEXT NOT NULL
        );`);

  // create users table
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

  // create properties table
  await db.query(`CREATE TABLE properties(
        property_id SERIAL PRIMARY KEY,
        host_id INT NOT NULL REFERENCES users(user_id),
        name VARCHAR(40) NOT NULL,
        location VARCHAR(40) NOT NULL,
        property_type VARCHAR(40) NOT NULL REFERENCES property_types(property_type),
        price_per_night DECIMAL NOT NULL,
        description TEXT
        );`);

  // Insert data into property_types table
  await db.query(
    format(
      `INSERT INTO property_types (property_type, description) VALUES %L`,
      property_types.map(({ property_type, description }) => [property_type, description])
    )
  );

  // Insert data into users table
  const { rows: inserted_users } = await db.query(
    format(
      `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *`,
      users.map(({ first_name, surname, email, phone_number, is_host, avatar }) => [
        first_name,
        surname,
        email,
        phone_number,
        is_host,
        avatar,
      ])
    )
  );

  const userRef = createUserRef(inserted_users);

  // Insert data into properties table
  await db.query(
    format(
      `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L`,
      formatProperties(properties, userRef)
    )
  );
}

module.exports = seed;
