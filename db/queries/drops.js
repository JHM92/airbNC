const db = require("../connection.js");

async function dropTables() {
  await db.query(`DROP TABLE IF EXISTS images;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS property_types;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
}

module.exports = dropTables;
