import {Router} from "express";
import {login} from "../controller/auth.controller.js";


const router = Router();

router.post("/login",login);


export default router;
