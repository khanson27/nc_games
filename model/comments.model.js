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
      return result.rows[0];
    });
};
