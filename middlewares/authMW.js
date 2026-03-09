import HTTPError from "../util/httpError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next(new HTTPError(401, "no token provided"));

    //get acccessToken from request
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return next(new HTTPError(401, "no token provided"));

    //validate accessToken
    let payload;
    try {
      payload = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET);
      // payload  => userId, role
    } catch (err) {
      return next(new HTTPError(401, err.message));
    }
    const user = await User.findById(payload.userId);
    if (!user) return next(new HTTPError(404, "user not found"));

    req.user = user;

    //forward to next
    next();
  } catch (err) {
    next(err);
  }
};
