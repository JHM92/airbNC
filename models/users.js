const db = require("../db/connection");

exports.fetchUserById = async (id) => {
  const { rows: user } = await db.query(
    `SELECT user_id,
    first_name,
    surname,
    email,
    phone_number,
    avatar,
    created_at FROM users
    WHERE users.user_id = $1;`,
    [id]
  );

  if (user.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  }

  return user[0];
};
