const db = require("../db/connection");

exports.fetchCategories = () => {
  console.log("in model");
  return db.query(`SELECT * FROM categories`).then((result) => {
    return result.rows;
  });
};
