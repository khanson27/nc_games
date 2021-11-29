const express = require("express");
const db = require("./db/connection");
const app = express();
const apiRouter = require("./router/api.router");

app.use(express.json());

app.use("/api", apiRouter);

module.exports = app;
