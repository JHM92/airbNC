const db = require("../db/connection");

exports.fetchProperties = async () => {
  const { rows: properties } = await db.query(
    `SELECT properties.property_id, 
    properties.name AS property_name,
    properties.location,
    properties.price_per_night,
    users.first_name || ' ' || users.surname AS host    
    FROM properties
    JOIN users ON properties.host_id = users.user_id
    LEFT JOIN favourites ON properties.property_id = favourites.property_id
    GROUP BY properties.property_id, property_name, properties.location, properties.price_per_night, host
    ORDER BY COUNT(properties.property_id) DESC;`
  );
  return properties;
};

exports.fetchPropertyById = async (id) => {
  const {
    rows: [property],
  } = await db.query(
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
    [id]
  );

  return property;
};
