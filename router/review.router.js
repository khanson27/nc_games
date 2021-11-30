const reviewRouter = require("express").Router();
const {
  getReviewById,
  patchReviewByVotes,
  getReviews,
} = require("../controller/review.controller");

reviewRouter.route("/:review_id").get(getReviewById).patch(patchReviewByVotes);
reviewRouter.route("/").get(getReviews);
module.exports = reviewRouter;
