const express = require("express");
const { getProperties, getPropertyById } = require("./controllers/properties");
const {
  handlePathNotFound,
  handleServerErrors,
  handleBadRequests,
  handleCustomErrors,
} = require("./errors");

const app = express();

app.get("/api/properties", getProperties);

app.get("/api/properties/:id", getPropertyById);

app.all("/*path", handlePathNotFound);

// ERROR HANDLING MIDDLEWARE FUNCTIONS

app.use(handleBadRequests);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
