const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  console.log("in model");

  return db
    .query(
      `DELETE FROM comments 
  WHERE comments.comment_id = $1`,
      [comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return result.rows[0];
    });
};
