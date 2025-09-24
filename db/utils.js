function createUserRef(users) {
  const ref = {};

  for (const user of users) {
    if (users.length > 0) {
      const fullName = user.first_name + " " + user.surname;
      ref[fullName] = user.user_id;
    }
  }

  return ref;
}

function formatProperties(properties, ref) {
  if (!properties) {
    return [];
  }
  return properties.map(
    ({ name, property_type, location, price_per_night, description, host_name }) => [
      ref[host_name],
      name,
      location,
      property_type,
      price_per_night,
      description,
    ]
  );
}

module.exports = { createUserRef, formatProperties };
