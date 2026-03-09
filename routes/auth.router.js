import { Router } from "express";
import {
  login,
  logout,
  refresh,
  registration,
} from "../controller/auth.controller.js";

import { RegisterUserValidator } from "../validations/userValidators.js";
import validateResults from "../validations/validateResults.js";

const router = Router();

router.post(
  "/registration",
  RegisterUserValidator,
  validateResults,
  registration,
);
router.post("/login", login);


router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
