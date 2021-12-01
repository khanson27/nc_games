const {
  fetchReviewById,
  updateReviewByVotes,
  fetchReviews,
  fetchCommentsByReviewId,
  insertComment,
} = require("../model/review.model");

exports.getReviewById = (req, res, next) => {
  console.log("in controller");
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewByVotes = (req, res, next) => {
  console.log("in controller");
  const { review_id } = req.params;
  const { inc_vote } = req.body;
  if (inc_vote === undefined) {
    throw Error("22P02");
  }
  updateReviewByVotes(review_id, inc_vote)
    .then((result) => {
      res.status(200).send({ review: result });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  console.log("in controller");
  const queryParams = req.query;
  fetchReviews(queryParams)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
exports.getCommentsByReviewId = (req, res, next) => {
  console.log("in controller");
  const { review_id } = req.params;
  fetchCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  console.log("in controller");
  const { review_id } = req.params;
  const postBody = req.body;
  insertComment(postBody, review_id)
    .then((result) => {
      res.status(201).send({ comment: result });
    })
    .catch(next);
};
