const db = require("../db/connection");
const format = require("pg-format");
const { calculateAverage } = require("../db/utils");

exports.fetchReviewsByPropertyId = async (property_id) => {
  const { rows: reviews } = await db.query(
    `
        SELECT reviews.review_id,
        reviews.comment,
        reviews.rating,
        reviews.created_at,
        users.first_name || ' ' || users.surname AS guest,
        users.avatar AS guest_avatar
        FROM reviews
        JOIN users ON reviews.guest_id = users.user_id
        WHERE reviews.property_id = $1
        ORDER BY created_at DESC;`,
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
  if (averageRating === undefined) {
    return [reviews, "No Ratings"];
  }
  return [reviews, averageRating];
};

exports.insertPropertyReview = async (guest_id, rating, comment, property_id) => {
  const { rows: checkPropertyId } = await db.query(
    `
    SELECT * FROM properties
    WHERE properties.property_id = $1;`,
    [property_id]
  );

  if (checkPropertyId.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found" });
  }

  const valuesToInsert = [guest_id, rating, comment, property_id];
  const {
    rows: [insertedReview],
  } = await db.query(
    format(
      `
    INSERT INTO reviews
    (guest_id, rating, comment, property_id)
    VALUES %L
    RETURNING *`,
      [valuesToInsert]
    )
  );

  return insertedReview;
};

exports.removeReviewById = async (review_id) => {
  const { rows: checkReviewId } = await db.query(
    `
    SELECT * FROM reviews
    WHERE reviews.review_id = $1`,
    [review_id]
  );

  if (checkReviewId.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  await db.query(
    `
    DELETE FROM reviews
    WHERE reviews.review_id = $1`,
    [review_id]
  );
};
