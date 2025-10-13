const db = require("./db/connection");

exports.getPropertyTypes = async () => {
  const { rows: propertyTypes } = db.query(`SELECT * FROM property_types`);
  return propertyTypes;
};
