const { fetchCategories } = require("../model/category.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      console.log(categories);
      res.status(200).send({ categories });
    })
    .catch(next);
};
