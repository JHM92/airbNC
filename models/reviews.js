const db = require("../db/connection");
const { calculateAverage } = require("../db/utils");

exports.fetchReviewsByPropertyId = async (property_id) => {
  const { rows: reviews } = await db.query(
    `
        SELECT reviews.review_id,
        reviews.comment,
        reviews.rating,
        CAST(reviews.created_at as date),
        users.first_name || ' ' || users.surname AS guest,
        users.avatar AS guest_avatar
        FROM reviews
        JOIN users ON reviews.guest_id = users.user_id
        WHERE reviews.property_id = $1;`,
    [property_id]
  );

  if (reviews.length === 0) {
    const { rows: checkPropertyId } = await db.query(
      `SELECT * FROM properties
       WHERE properties.property_id = $1;`,
      [property_id]
    );

    if (checkPropertyId.length === 0) {
      return Promise.reject({ status: 404, msg: "Property not found" });
    }
  }

  const ratings = reviews.map(({ rating }) => rating);
  const averageRating = calculateAverage(ratings);
  return [reviews, averageRating];
};
