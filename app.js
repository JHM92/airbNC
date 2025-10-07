const express = require("express");
const { getProperties } = require("./controllers/properties");
const { handlePathNotFound } = require("./errors");

const app = express();

app.get("/api/properties", getProperties);

app.all("/*path", handlePathNotFound);

module.exports = app;
