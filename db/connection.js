const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
console.log(ENV);

require("dotenv").config(`${__dirname}/../.env.${ENV}`);

const pool = new Pool();

module.exports = pool;
