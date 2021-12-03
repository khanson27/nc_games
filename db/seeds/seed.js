const db = require("../connection");
const format = require("pg-format");

const seed = ({ categoryData, commentData, reviewData, userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS reviews;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS categories;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE categories (
     slug VARCHAR(50) PRIMARY KEY,
     description VARCHAR(300) NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(50) PRIMARY KEY,
      avatar_url TEXT NOT NULL,
      name VARCHAR(100) NOT NULL
    );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE reviews(
      review_id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      review_body TEXT NOT NULL,
      designer VARCHAR(100) NOT NULL,
      review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', 
      votes INT DEFAULT 0 NOT NULL,
      category VARCHAR(50) REFERENCES categories(slug) ON DELETE CASCADE,
      owner VARCHAR (50) REFERENCES users(username) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
      comment_id SERIAL PRIMARY KEY, 
      author VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE, 
      review_id INT REFERENCES reviews(review_id),
      votes INT DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      body TEXT 
      );`);
    })
    .then(() => {
      const formattedCategories = categoryData.map((category) => {
        return [category.slug, category.description];
      });
      const queryStr = format(
        `INSERT INTO categories (slug, description)
    VALUES
    %L
    RETURNING *`,
        formattedCategories
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedUserData = userData.map((user) => {
        return [user.username, user.avatar_url, user.name];
      });
      const queryStr = format(
        `INSERT INTO users (username, avatar_url, name)
  VALUES
  %L
  RETURNING *;
  `,
        formattedUserData
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedReviewData = reviewData.map((review) => {
        return [
          review.title,
          review.review_body,
          review.designer,
          review.review_img_url,
          review.votes,
          review.category,
          review.owner,
          review.created_at,
        ];
      });
      const queryStr = format(
        `INSERT INTO reviews (title, review_body, designer, review_img_url, votes,category, owner, created_at)
        VALUES
        %L;`,
        formattedReviewData
      );
      return db.query(queryStr);
    })
    .then(() => {
      const formattedCommentData = commentData.map((comment) => {
        return [
          comment.author,
          comment.review_id,
          comment.votes,
          comment.created_at,
          comment.body,
        ];
      });
      const queryStr = format(
        `INSERT INTO comments (author, review_id, votes, created_at, body)
  VALUES
  %L`,
        formattedCommentData
      );
      return db.query(queryStr);
    });
};

module.exports = seed;
