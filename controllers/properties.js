const { fetchProperties, fetchPropertyById } = require("../models/properties");
exports.getProperties = async (req, res, next) => {
  const properties = await fetchProperties();
  res.status(200).send({ properties: properties });
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const args = [];
  args.push(id);
  if (Object.hasOwn(req.query, "user_id")) {
    args.push(req.query.user_id);
  }
  const property = await fetchPropertyById(args);
  res.status(200).send({ property: property });
};
