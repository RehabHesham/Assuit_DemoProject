import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controller/user.cotroller.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validations/userValidators.js";
import validateResults from "../validations/validateResults.js";
import { idParamValidator } from "../validations/validateMongoID.js";
const router = Router();

//   /api/users  from router mounting
router.get("/", getAllUsers);
router.post("/", createUserValidator, validateResults, createUser); //Validate  express-validator

router.get("/:id", idParamValidator, validateResults, getUserById); //Validate  check id is ObjectId
router.delete("/:id", idParamValidator, validateResults, deleteUser); //Validate

router.patch(
  "/:id",
  idParamValidator,
  validateResults,
  updateUserValidator,
  validateResults,
  updateUser,
); //Validate express-validator

export default router;
