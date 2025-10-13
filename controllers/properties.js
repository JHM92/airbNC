const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  const args = [];
  if (Object.hasOwn(req.query, "property_type")) {
    args.push(req.query.property_type);
  }

  const properties = await fetchProperties(args);
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
