const { removeComment } = require("../model/comments.model");

exports.deleteComment = (req, res, next) => {
  console.log("in controller");
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then((comment) => {
      res.status(204).send({});
    })
    .catch(next);
};
