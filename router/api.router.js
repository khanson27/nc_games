const express = require("express");
const userRouter = require("./user.router");
const reviewRouter = require("./review.router");
const commentRouter = require("./comment.router");
const categoryRouter = require("./categories.router");
const { getAPI } = require("../controller/api.controller");
const apiRouter = express.Router();

apiRouter.use("/categories", categoryRouter);
apiRouter.use("/reviews", reviewRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);
apiRouter.route("/").get(getAPI);
module.exports = apiRouter;
