const express = require("express");
const userRouter = require("./user.router");
const reviewRouter = require("./review.router");
const commentRouter = require("./comment.router");
const categoryRouter = require("./categories.router");
const apiRouter = express.Router();

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
