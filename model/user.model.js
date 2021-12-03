const db = require("../db/connection");

exports.fetchUsers = () => {
  console.log("in model");
  return db.query(`SELECT username FROM users`).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "path not found" });
    }
    return result.rows;
  });
};

exports.fetchUserByUsername = (username) => {
  console.log("in model");
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
      return result.rows[0];
    });
};
