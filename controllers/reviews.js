const { fetchReviewsByPropertyId, insertPropertyReview } = require("../models/reviews");

exports.getReviewsByPropertyId = async (req, res, next) => {
  const property_id = req.params.id;
  const reviews = await fetchReviewsByPropertyId(property_id);
  res.status(200).send({ reviews: reviews[0], average_rating: reviews[1] });
};

exports.postPropertyReview = async (req, res, next) => {
  const { guest_id, rating, comment } = req.body;
  const { id: property_id } = req.params;
  const review = await insertPropertyReview(guest_id, rating, comment, property_id);
  res.status(201).send(review);
};
