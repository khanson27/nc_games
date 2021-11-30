const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
  console.log("in model");
  return db
    .query(
      `SELECT
      reviews.*,
      CAST(COUNT(comments.review_id) AS int) AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then((result) => {
      const review = result.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `no review for ${review_id}`,
        });
      } else {
        return result.rows;
      }
    });
};

exports.updateReviewByVotes = (review_id, inc_vote) => {
  console.log("in model");
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [inc_vote, review_id]
    )
    .then((reviews) => {
      const review = reviews.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `no review for ${review_id}`,
        });
      } else {
        return reviews.rows;
      }
    });
};

exports.fetchReviews = ({
  sort_by = "created_by",
  order = "DESC",
  category,
}) => {
  console.log("in model");
  if (
    !["created_by", "category"].includes(sort_by) &&
    !["ASC", "DESC"].includes(order)
  ) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  if (category === undefined) {
    return db.query(
      `SELECT reviews.*,
       CAST(COUNT(comments.review_id) AS int) AS comment_count
       FROM reviews`
    );
  }
};
