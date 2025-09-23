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

module.exports = createUserRef;
