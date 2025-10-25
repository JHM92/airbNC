const db = require("../db/connection");
const { fetchUserById } = require("./users");
const { getPropertyTypes } = require("../db/queries/queries");
const { validatePropertyTypes } = require("../db/utils");

exports.fetchProperties = async (propertyTypes, sortBy, orderBy) => {
  const propertyTypesToValidate = propertyTypes.flat();

  const baseQuery = `SELECT properties.property_id, 
    properties.name AS property_name,
    properties.location,
    properties.price_per_night,
    users.first_name || ' ' || users.surname AS host    
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id`;

  const groupBy = ` GROUP BY properties.property_id, property_name, properties.location, properties.price_per_night, host
    `;

  let propertyTypeQuery = "";
  let sortQueryBy = "ORDER BY COUNT(favourites.property_id) DESC";
  let order = "";

  if (propertyTypes.length === 1) {
    const validPropertyTypes = await getPropertyTypes();
    const propertyTypesAreValid = validatePropertyTypes(
      propertyTypesToValidate,
      validPropertyTypes
    );
    if (propertyTypesAreValid) {
      for (const propertyType of propertyTypesToValidate) {
        if (propertyTypeQuery === "") {
          propertyTypeQuery += ` WHERE properties.property_type = '${propertyType}' `;
        } else {
          propertyTypeQuery += `OR properties.property_type = '${propertyType}' `;
        }
      }
    } else {
      return Promise.reject({ status: 404, msg: "Property type does not exist" });
    }
  }

  if (orderBy === "ascending") {
    order = "ASC";
  } else if (orderBy === "descending") {
    order = "DESC";
  }

  if (sortBy === "cost_per_night") {
    sortQueryBy = `ORDER BY properties.price_per_night ${order}`;
    console.log(sortQueryBy);
  } else if (sortBy === "popularity") {
    sortQueryBy = `ORDER BY COUNT(favourites.property_id) ${order}`;
    console.log(sortQueryBy);
  }

  const finalQuery = baseQuery + propertyTypeQuery + groupBy + sortQueryBy + ";";
  console.log(finalQuery);

  const { rows: properties } = await db.query(finalQuery);

  return properties;
};

exports.fetchPropertyById = async (args) => {
  const property_id = args[0];

  const { rows: property } = await db.query(
    `SELECT properties.property_id,
    properties.name AS property_name,
    properties.location,
    properties.price_per_night,
    properties.description,
    users.first_name || ' ' || users.surname AS host,
    users.avatar AS host_avatar,
    COUNT(properties.property_id) AS favourite_count 
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id
    WHERE properties.property_id = $1
    GROUP BY properties.property_id, property_name, properties.location, 
    properties.price_per_night, properties.description, host, host_avatar;
    `,
    [property_id]
  );

  if (property.length === 0) {
    return Promise.reject({ status: 404, msg: "Property not found" });
  }

  if (args.length === 2) {
    const user_id = args[1];
    const {
      rows: [isFavourited],
    } = await db.query(
      `SELECT * FROM favourites
    WHERE favourites.guest_id = $1
    AND favourites.property_id = $2;
    `,
      [user_id, property_id]
    );

    if (isFavourited === undefined) {
      property[0]["favourited"] = false;
      const { rows: checkId } = await db.query(
        `
        SELECT * FROM users WHERE user_id = $1`,
        [user_id]
      );
      if (checkId.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
    } else {
      property[0]["favourited"] = true;
    }
  }

  return property[0];
};
