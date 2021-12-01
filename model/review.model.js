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
      GROUP BY reviews.review_id;`,
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
  sort_by = "created_at",
  order = "DESC",
  category,
}) => {
  console.log("in model");
  if (
    ![
      "created_at",
      "owner",
      "title",
      "review_id",
      "category",
      "review_img_url",
      "votes",
      "comment_count",
    ].includes(sort_by) &&
    !["ASC", "DESC"].includes(order)
  ) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
  if (category === undefined) {
    return db
      .query(
        `SELECT
      reviews.*,
      CAST(COUNT(comments.review_id) AS int) AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}
      ;`
      )
      .then((reviews) => {
        return reviews.rows;
      });
  } else {
    return db
      .query(
        `SELECT
      reviews.*,
      CAST(COUNT(comments.review_id) AS int) AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      WHERE category = $1
      GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}
      ;`,
        [category]
      )
      .then((reviews) => {
        return reviews.rows;
      });
  }
};

exports.fetchCommentsByReviewId = (review_id) => {
  console.log("in model");
  return db
    .query(
      `SELECT comments.* 
  FROM comments
  WHERE comments.review_id = $1`,
      [review_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertComment = (postBody, review_id) => {
  console.log("in model");
  const { username, body } = postBody;
  return db
    .query(
      `INSERT INTO comments(author, body, review_id) 
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
      [username, body, review_id]
    )
    .then((result) => {
      return result.rows;
    });
};
