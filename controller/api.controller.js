const endpoints = require("../endpoints.json");

exports.getAPI = (req, res, next) => {
  console.log("in controller");
  res.status(200).send({ endpoints_JSON: endpoints });
};
