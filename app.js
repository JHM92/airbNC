const express = require("express");
const { getProperties, getPropertyById } = require("./controllers/properties");
const { handlePathNotFound } = require("./errors");

const app = express();

app.get("/api/properties", getProperties);

app.get("/api/properties/:id", getPropertyById);

app.all("/*path", handlePathNotFound);

module.exports = app;
