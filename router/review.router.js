const reviewRouter = require("express").Router();
const {
  getReviewById,
  patchReviewByVotes,
  getReviews,
  getCommentsByReviewId,
  postComment,
} = require("../controller/review.controller");

reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewByVotes);
reviewRouter
  .route("/:review_id/comments")
  .get(getCommentsByReviewId)
  .post(postComment);
reviewRouter.route("/").get(getReviews);
module.exports = reviewRouter;
