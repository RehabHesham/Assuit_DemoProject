import Post from "../models/post.js";
import HTTPError from "../util/httpError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return next(new HTTPError(401, "Authentication Required."));

    if (!roles.includes(req.user.role))
      return next(new HTTPError(403, "Insufficient permissions"));

    next();
  };
};

export const authorizwPostOwnerOrAdmin = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const role = req.user.role;

    const post = await Post.findById(postId);
    if (!post) return next(new HTTPError(404, "post not found"));

    // allow for owner or admin
    if (post.user.toString() === userId || role === "admin") {
      req.post = post;
      return next();
    }

    return next(new HTTPError(403, "Not authorized to perform this action."));
  } catch (err) {
    next(err);
  }
};

export const authorizwCommentOwnerOrAdmin = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.cid;
    const userId = req.user._id;
    const role = req.user.role;

    const post = await Post.findById(postId);
    if (!post) return next(new HTTPError(404, "post not found"));

    const comment = post.comments.id(commentId);
    if (!comment) return next(new HTTPError(404, "comment not found"));

    // allow for owner or admin
    if (comment.user.toString() === userId || role === "admin") {
      req.post = post;
      return next();
    }

    return next(new HTTPError(403, "Not authorized to perform this action."));
  } catch (err) {
    next(err);
  }
};
