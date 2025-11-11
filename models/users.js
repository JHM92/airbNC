const { string } = require("pg-format");
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

exports.updateUserById = async (id, firstName, surname, email, phone, avatar) => {
  const propertiesToUpdate = {};
  const valuesToPass = [];
  if (firstName) {
    if (typeof firstName !== "string") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    propertiesToUpdate["first_name"] = firstName;
    valuesToPass.push(firstName);
  }

  if (surname) {
    if (typeof surname !== "string") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    propertiesToUpdate["surname"] = surname;
    valuesToPass.push(surname);
  }

  if (email) {
    if (typeof email !== "string") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    propertiesToUpdate["email"] = email;
    valuesToPass.push(email);
  }

  if (phone) {
    if (typeof phone !== "string") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    propertiesToUpdate["phone_number"] = phone;
    valuesToPass.push(phone);
  }

  if (avatar) {
    if (typeof avatar !== "string") {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    propertiesToUpdate["avatar"] = avatar;
    valuesToPass.push(avatar);
  }

  if (valuesToPass.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let queryString = `UPDATE users\nSET\n`;

  let propertyIndex = 1;
  for (const property in propertiesToUpdate) {
    queryString += `${property} = $${propertyIndex},\n`;
    propertyIndex++;
  }

  queryString = queryString.slice(0, -2);
  queryString += `\nWHERE user_id = $${propertyIndex}\nRETURNING *;`;

  valuesToPass.push(id);

  const { rows: updatedUser } = await db.query(queryString, valuesToPass);

  return updatedUser[0];
};
