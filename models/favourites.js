const db = require("../db/connection");
const format = require("pg-format");

exports.insertFavouriteProperty = async (guestId, propertyId) => {
  const valuesToInsert = [guestId, propertyId];

  const { rows: checkIfAlreadyFavourited } = await db.query(
    `
    SELECT * FROM favourites
    WHERE favourites.guest_id = $1
    AND favourites.property_id = $2;`,
    [guestId, propertyId]
  );

  if (checkIfAlreadyFavourited.length > 0) {
    return Promise.reject({ status: 409, msg: "Already favourited." });
  }

  const { rows: checkGuestIdExists } = await db.query(
    `SELECT * FROM users
    WHERE users.user_id = $1;`,
    [guestId]
  );

  if (checkGuestIdExists.length === 0) {
    return Promise.reject({ status: 404, msg: "Guest not found" });
  }

  const { rows: checkPropertyIdExists } = await db.query(
    `SELECT * FROM properties
    WHERE properties.property_id = $1;`,
    [propertyId]
  );

  if (checkPropertyIdExists.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found" });
  }

  const {
    rows: [insertedFavourite],
  } = await db.query(
    format(
      `
    INSERT INTO favourites
    (guest_id, property_id)
    VALUES %L
    RETURNING *`,
      [valuesToInsert]
    )
  );

  return insertedFavourite;
};
