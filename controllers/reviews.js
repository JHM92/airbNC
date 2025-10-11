const { fetchReviewsByPropertyId } = require("../models/reviews");

exports.getReviewsByPropertyId = async (req, res, next) => {
  const property_id = req.params.id;
  const reviews = await fetchReviewsByPropertyId(property_id);
  res.status(200).send({ reviews: reviews[0], average_rating: reviews[1] });
};
