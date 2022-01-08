const db = require("../db/connection");

exports.fetchCategories = (param) => {
  if (param === undefined) {
    return db.query(`SELECT * FROM categories`).then((result) => {
      return result.rows;
    });
  } else {
    const { category } = param;
    if (category) {
      return db
        .query(`SELECT * FROM categories WHERE slug = $1`, [category])
        .then((result) => {
          if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "category not found" });
          } else {
            return result.rows;
          }
        });
    }
  }
};
