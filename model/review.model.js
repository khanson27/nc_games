const db = require("../db/connection");

exports.fetchReviewById = (review_id) => {
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
          msg: `no review for review id ${review_id}`,
        });
      } else {
        return result.rows[0];
      }
    });
};

exports.updateReviewByVotes = (review_id, inc_votes = 0) => {
  if (!inc_votes === "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `UPDATE reviews 
      SET votes = votes + $1 
      WHERE review_id = $2 
      RETURNING *;`,
      [inc_votes, review_id]
    )
    .then((reviews) => {
      const review = reviews.rows[0];
      if (!review) {
        return Promise.reject({
          status: 404,
          msg: `no review for review id ${review_id}`,
        });
      } else {
        return reviews.rows[0];
      }
    });
};

exports.fetchReviews = ({
  sort_by = "created_at",
  order = "DESC",
  category,
}) => {
  if (
    ![
      "created_at",
      "owner",
      "title",
      "review_id",
      "category",
      "votes",
      "comment_count",
    ].includes(sort_by) ||
    !["ASC", "DESC"].includes(order)
  ) {
    return Promise.reject({ status: 400, msg: "column does not exist" });
  } else if (category === undefined) {
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
      WHERE reviews.category = $1
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
  return db
    .query(
      `SELECT * 
  FROM reviews 
  WHERE reviews.review_id = $1`,
      [review_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "review_id not found" });
      } else {
        return db.query(
          `SELECT comments.* 
  FROM comments
  WHERE comments.review_id = $1`,
          [review_id]
        );
      }
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return [];
      } else {
        return result.rows;
      }
    });
};

exports.insertComment = (postBody, review_id) => {
  const { username, body } = postBody;
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return db
      .query(
        `SELECT * 
    FROM users 
    WHERE users.username = $1`,
        [username]
      )
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({ status: 404, msg: "user not found" });
        } else {
          return db
            .query(
              `INSERT INTO comments(author, body, review_id) 
  VALUES
  ($1, $2, $3)
  RETURNING *;`,
              [username, body, review_id]
            )
            .then((result) => {
              if (result.rows.length === 0) {
                return Promise.reject({
                  status: 404,
                  msg: "review_id not found",
                });
              }
              return result.rows[0];
            });
        }
      });
  }
};
