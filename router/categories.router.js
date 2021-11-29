const categoriesRouter = require("express").Router();
const { getCategories } = require("../controller/category.controller");

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
