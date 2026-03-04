import { validationResult } from "express-validator";
import HTTPError from "../util/httpError.js";

export default (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // send errors
        const customError = new HTTPError(400, "Validation Error");
        customError.errors = errors.array();
        next(customError);
    }
    next();
}