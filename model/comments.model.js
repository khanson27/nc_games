const db = require("../db/connection");

exports.removeComment = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      } else {
        return db
          .query(
            `DELETE FROM comments 
  WHERE comments.comment_id = $1`,
            [comment_id]
          )
          .then((result) => {
            return result.rows;
          });
      }
    });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "no input for votes" });
  }
  return db
    .query(
      `UPDATE comments 
  SET votes = votes + $1 
  WHERE comment_id =$2 
  RETURNING *`,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return result.rows[0];
    });
};
