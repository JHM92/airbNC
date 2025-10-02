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

function createPropertyRef(properties) {
  const ref = {};
  for (const property of properties) {
    ref[property.name] = property.property_id;
  }
  return ref;
}

function formatReviews(reviews, userRef, propertyRef) {
  return reviews.map(({ guest_name, property_name, rating, comment, created_at }) => [
    propertyRef[property_name],
    userRef[guest_name],
    rating,
    comment,
    created_at,
  ]);
}

function formatImages(images, propertyRef) {
  return images.map(({ property_name, image_url, alt_tag }) => [
    propertyRef[property_name],
    image_url,
    alt_tag,
  ]);
}

function formatFavourites(favourites, userRef, propertyRef) {
  return favourites.map(({ guest_name, property_name }) => [
    userRef[guest_name],
    propertyRef[property_name],
  ]);
}

module.exports = {
  createUserRef,
  createPropertyRef,
  formatProperties,
  formatReviews,
  formatImages,
  formatFavourites,
};
