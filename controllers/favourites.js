const { insertFavouriteProperty, deleteFavouriteProperty } = require("../models/favourites");

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

exports.deleteFavourite = async (req, res, next) => {
  const guestId = req.params.userId;
  const propertyId = req.params.propertyId;
  await deleteFavouriteProperty(guestId, propertyId);
  res.status(204).send();
};
