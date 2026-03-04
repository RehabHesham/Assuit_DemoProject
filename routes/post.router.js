import { Router } from "express";
import {
  getAllPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} from "../controller/post.controller.js";
import {
  idParamValidator,
  cidParamValidator,
} from "../validations/validateMongoID.js";
import validateResults from "../validations/validateResults.js";
import { paginationValidator } from "../validations/paginationValidator.js";
import { createPostValidator } from "../validations/postValidators.js";

const router = Router();

///    /api/posts   from routes mounting

router.get("/",paginationValidator,validateResults, getAllPosts);
router.post("/",createPostValidator,validateResults, createPost);

router.get("/:id", idParamValidator, validateResults, getPostById);
router.patch("/:id", idParamValidator, validateResults, updatePost);
router.delete("/:id", idParamValidator, validateResults, deletePost);

router.post("/:id/like", idParamValidator, validateResults, likePost);
router.delete("/:id/unlike", idParamValidator, validateResults, unlikePost);

router.post("/:id/comments", idParamValidator, validateResults, createComment);
router.get("/:id/comments", idParamValidator, validateResults, getAllComments);

router.patch(
  "/:id/comments/:cId",
  idParamValidator,
  cidParamValidator,
  validateResults,
  updateComment,
);
router.delete(
  "/:id/comments/:cId",
  idParamValidator,
  cidParamValidator,
  validateResults,
  deleteComment,
);

export default router;
