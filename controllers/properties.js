const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  const propertyTypes = [];
  if (Object.hasOwn(req.query, "property_type")) {
    propertyTypes.push(req.query.property_type);
  }

  let sortBy = "";
  let orderBy = "";
  let minPrice = null;
  let maxPrice = null;
  let hostId = null;

  if (Object.hasOwn(req.query, "sort")) {
    sortBy = req.query.sort;
  }

  if (Object.hasOwn(req.query, "order")) {
    orderBy = req.query.order;
  }

  if (Object.hasOwn(req.query, "minprice")) {
    minPrice = req.query.minprice;
  }

  if (Object.hasOwn(req.query, "maxprice")) {
    maxPrice = req.query.maxprice;
  }

  if (Object.hasOwn(req.query, "host")) {
    hostId = req.query.host;
  }

  const properties = await fetchProperties(
    propertyTypes,
    sortBy,
    orderBy,
    minPrice,
    maxPrice,
    hostId
  );
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
