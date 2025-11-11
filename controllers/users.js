const { fetchUserById, updateUserById } = require("../models/users");

exports.getUserById = async (req, res, next) => {
  const id = req.params.id;
  const user = await fetchUserById(id);
  res.status(200).send({ user: user });
};

exports.patchUserById = async (req, res, next) => {
  const userId = req.params.id;
  const firstName = req.body.first_name ? req.body.first_name : null;
  const surname = req.body.surname ? req.body.surname : null;
  const email = req.body.email ? req.body.email : null;
  const phone = req.body.phone ? req.body.phone : null;
  const avatar = req.body.avatar ? req.body.avatar : null;

  const updatedUser = await updateUserById(userId, firstName, surname, email, phone, avatar);

  res.status(200).send(updatedUser);
};
