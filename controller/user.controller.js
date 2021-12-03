const { fetchUsers, fetchUserByUsername } = require("../model/user.model");

exports.getUsers = (req, res, next) => {
  console.log("in controller");
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  console.log("in controller");
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
