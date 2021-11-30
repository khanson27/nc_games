const {
  fetchReviewById,
  updateReviewByVotes,
  fetchReviews,
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
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};
