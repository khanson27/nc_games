const express = require("express");
const db = require("./db/connection");
const app = express();
const apiRouter = require("./router/api.router");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use("/api", (err, req, res, next) => {
  if (err.code === "22P02" || err.error === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "internal server error" });
  }
});

module.exports = app;
