import { query } from "express-validator";

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be number greater that 0")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be number greater that 0")
    .toInt(),
];