const commentRouter = require("express").Router();
const {
  deleteComment,
  patchCommentVotes,
} = require("../controller/comments.controller");

commentRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchCommentVotes);

module.exports = commentRouter;
