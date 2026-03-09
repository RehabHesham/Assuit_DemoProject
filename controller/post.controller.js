import Post from "../models/post.js";
import HTTPError from "../util/httpError.js";

export const getAllPosts = async (req, res, next) => {
  try {
    // divide my data into pages
    // page capacity(limit)  =>  limit()
    // page number (page)   =>  skip()

    const { page = 1, limit = 2 } = req.query;
    // page 1  skip -> limit*0 >0
    // page 2  skip -> limit*1 > 2
    // page 3  skip -> limit*2 > 4
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit).lean();

    const total = await Post.countDocuments();
    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      total, // how many posts
      page, // current page
      pages, // how many pages
      posts, // posts in current page
    });
  } catch (err) {
    next(err);
  }
};
export const createPost = async (req, res, next) => {
  try {
    const { content, tags } = req.body;
    const userId = req.user._id;
    console.log(content, tags, userId);
    const post = await Post.create({
      content,
      tags,
      user: userId,
    });

    return res.status(201).json({
      message: "Post created",
      post,
    });
  } catch (err) {
    next(err);
  }
};
export const getPostById = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const updatePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const deletePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const likePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const unlikePost = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const createComment = async (req, res, next) => {
  try {
    // console.log(req.body);
    const { content, userId } = req.body;
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return next(new HTTPError(404, "Post not found"));

    post.comments.push({
      user: userId,
      content,
    });

    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};
export const getAllComments = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { cId } = req.params;
    const { content } = req.body;

    const post = req.post;

    const comment = post.comments.id(cId);
    if (!comment) return next(new HTTPError(404, "comment not found"));

    comment.content = content || comment.content;
    await post.save();

    return res.status(200).json({
      message: "Comment updated",
      post,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const { id, cId } = req.params;
    const post = await Post.findById(id);
    if (!post) return next(new HTTPError(404, "post not found"));

    const comment = post.comments.id(cId);
    if (!comment) return next(new HTTPError(404, "comment not found"));

    if (comment.user.toString() !== userId)
      return next(new HTTPError(403, "Forbidden operation"));

    await comment.deleteOne(); // delete comment
    await post.save();
    return res.status(200).json({
      message: "Comment deleted",
    });
  } catch (err) {
    next(err);
  }
};
