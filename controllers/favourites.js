const { insertFavouriteProperty } = require("../models/favourites");

exports.postFavourite = async (req, res, next) => {
  if (req.body !== undefined) {
    const guestId = req.body.guest_id;
    const propertyId = req.params.id;

    const favourite = await insertFavouriteProperty(guestId, propertyId);
    res
      .status(201)
      .send({ msg: "Property favourited successfully.", favourite_id: favourite.favourite_id });
  } else {
    res.status(400).send({ msg: "Bad Request" });
  }
};
