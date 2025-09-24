const db = require("./connection.js");
const format = require("pg-format");
const dropTables = require("./queries/drops.js");
const { createUserRef, formatProperties, createPropertyRef, formatReviews } = require("./utils.js");

async function seed(property_types, users, properties, reviews) {
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

  await db.query(`CREATE TABLE reviews(
        review_id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(property_id),
        guest_id INT NOT NULL REFERENCES users(user_id),
        rating INT NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

  // Insert data into property_types table
  await db.query(
    format(
      `INSERT INTO property_types (property_type, description) VALUES %L`,
      property_types.map(({ property_type, description }) => [property_type, description])
    )
  );

  // Insert data into users table
  const { rows: insertedUsers } = await db.query(
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

  const userRef = createUserRef(insertedUsers);

  // Insert data into properties table
  const { rows: insertedProperties } = await db.query(
    format(
      `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
      formatProperties(properties, userRef)
    )
  );

  const propertyRef = createPropertyRef(insertedProperties);

  //Insert data into reviews table
  await db.query(
    format(
      `INSERT INTO reviews (property_id, guest_id, rating, comment, created_at) VALUES %L`,
      formatReviews(reviews, userRef, propertyRef)
    )
  );
}

module.exports = seed;
