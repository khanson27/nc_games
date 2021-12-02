exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};
exports.handlePsqlErrors = (err, req, res, next) => {
  console.log("psql error");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "42601") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "42703") {
    res.status(400).send({ msg: "column does not exist" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "this key does not exist on parent table" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
