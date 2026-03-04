import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "comment must contain content"],
      maxlength: [200, "post can't exceed 200 char"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "comment must belong to user"],
    },
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    content: {
      type: String,
      require: [true, "Post must contain text"],
      maxlength: [1000, "post can't exceed 1000 char"],
    },
    tags: {
      type: [
        {
          type: String,
          minlength: [3, "tag must be at least 3 char"],
          maxlength: [30, "tag can't exceed 30 char"],
          match: [
            /^[a-zA-Z0-9 ]*/,
            "Tag only contains letters and numbers and space",
          ],
        },
      ],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "post can only contain up t 5 tags.",
      },
      default: [],
    },
    likes: [
      // refrence
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      // refrence
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "post must belong to a user"],
    },
    // comment as embedded object
    // hard to deal with
    //   comments: [
    //     {
    //       content: String,
    //       user: {
    //         type: Schema.Types.ObjectId,
    //         ref: "User",
    //       },
    //     },
    //   ],
    comments: [commentSchema],
  },
  { timestamps: true },
);

export default model("Post", postSchema);
