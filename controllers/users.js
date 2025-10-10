const { fetchUserById } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const id = req.params.id;
  const user = await fetchUserById(id);
  res.status(200).send({ user: user });
};
