const db = require("../connection");

exports.getPropertyTypes = async () => {
  const { rows: propertyTypes } = await db.query(`SELECT property_type FROM property_types`);
  return propertyTypes;
};
