const express = require("express");
const db = require("./db/connection");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/error.handler");
const app = express();
const apiRouter = require("./router/api.router");

app.use(express.json());

app.use("/api", apiRouter);
app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
