const express = require("express");
const { getProperties, getPropertyById } = require("./controllers/properties");
const {
  handlePathNotFound,
  handleServerErrors,
  handleBadRequests,
  handleCustomErrors,
} = require("./errors");

const { getUserById } = require("./controllers/users");
const {
  getReviewsByPropertyId,
  postPropertyReview,
  deleteReviewById,
} = require("./controllers/reviews");

const app = express();

app.use(express.json());

app.get("/api/properties", getProperties);

app.get("/api/properties/:id", getPropertyById);

app.get("/api/users/:id", getUserById);

app.get("/api/properties/:id/reviews", getReviewsByPropertyId);

app.post("/api/properties/:id/reviews", postPropertyReview);

app.delete("/api/reviews/:id", deleteReviewById);

app.all("/*path", handlePathNotFound);

// ERROR HANDLING MIDDLEWARE FUNCTIONS

app.use(handleBadRequests);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
