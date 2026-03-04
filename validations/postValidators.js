import { body } from "express-validator";

export const createPostValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 1000 })
    .withMessage("Content can't exceed 1000 char")
    .escape(),
  body("tags")
    .optional()
    .isArray({ max: 5 })
    .withMessage("tags must be an array of strings with 5 max elements"),
  body("tags.*")
    .optional()
    .notEmpty()
    .withMessage("tag can't be empty")
    .isString()
    .withMessage("each tag must be a string")
    .trim(),
];
