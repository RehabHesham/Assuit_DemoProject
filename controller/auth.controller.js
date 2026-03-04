import User from "../models/user.js";
import HTTPError from "../util/httpError.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new HTTPError(401, "wrong email or password"));

    if (user.password !== password)
      next(new HTTPError(401, "wrong email or password"));

    return res.status(200).json({ message: "user authenticated" });
  } catch (err) {
    next(err);
  }
};
