const express = require("express");
const { getProperties, getPropertyById } = require("./controllers/properties");
const {
  handlePathNotFound,
  handleServerErrors,
  handleBadRequests,
  handleCustomErrors,
  handleInvalidMethods,
} = require("./errors");

const { getUserById, patchUserById } = require("./controllers/users");
const {
  getReviewsByPropertyId,
  postPropertyReview,
  deleteReviewById,
} = require("./controllers/reviews");
const { postFavourite, deleteFavourite } = require("./controllers/favourites");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.route("/api/properties").get(getProperties).all(handleInvalidMethods);

app.route("/api/properties/:id").get(getPropertyById).all(handleInvalidMethods);

app.route("/api/users/:id").get(getUserById).patch(patchUserById).all(handleInvalidMethods);

app
  .route("/api/properties/:id/reviews")
  .get(getReviewsByPropertyId)
  .post(postPropertyReview)
  .all(handleInvalidMethods);

app.route("/api/properties/:id/favourite").post(postFavourite).all(handleInvalidMethods);

app.route("/api/reviews/:id").delete(deleteReviewById).all(handleInvalidMethods);

app
  .route("/api/properties/:propertyId/users/:userId/favourite")
  .delete(deleteFavourite)
  .all(handleInvalidMethods);

app.all("/*path", handlePathNotFound);

// ERROR HANDLING MIDDLEWARE FUNCTIONS

app.use(handleBadRequests);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
