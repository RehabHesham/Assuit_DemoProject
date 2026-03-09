import User from "../models/user.js";
import HTTPError from "../util/httpError.js";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/refreshToken.js";

export const registration = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const user = await User.create({
      email,
      name,
      password,
      role: "user",
    });

    return res.status(201).json({
      message: "account created move to login",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log("test");
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return next(new HTTPError(401, "wrong email or password"));

    const isMatched = await user.comparePassword(password);
    if (!isMatched) return next(new HTTPError(401, "wrong email or password"));

    // user is authenticated
    // generate jwt with user info

    //jwt.sign(payload,secret,otions);
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXP },
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXP,
      },
    );
    console.log("refresh token storing");
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "user authenticated", accessToken });
  } catch (err) {
    next(err);
  }
};

// delete refresh token
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new HTTPError(400, "refresh token required"));

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (err) {
      next(new HTTPError(401, "Invalid Refresh token"));
    }

    const userTokens = await RefreshToken.find({ user: payload.userId });

    console.log("search for refresh token");
    const comparosons = await Promise.all(
      userTokens.map((t) => t.compareToken(refreshToken)),
    );
    const matchedIndex = comparosons.findIndex((match) => match === true);
    console.log("check matched token");
    if (matchedIndex === -1)
      return next(new HTTPError(401, "Refresh Token not found"));

    const storedRefreshToken = userTokens[matchedIndex];
    await RefreshToken.findByIdAndDelete(storedRefreshToken._id);

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: "logout successfully",
      });
  } catch (err) {
    next(err);
  }
};

// generate new access Token
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return next(new HTTPError(400, "refresh token required"));

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
    } catch (err) {
      next(new HTTPError(401, "Invalid Refresh token"));
    }

    const userTokens = await RefreshToken.find({ user: payload.userId });

    const comparosons = await Promise.all(
      userTokens.map((t) => t.compareToken(refreshToken)),
    );
    /*
    userTokens  => array

    inside map  bcrypt.comare  => return boolean
    
    userTokens.map => return new array of booleans

    userTokens,userTokens.map => two arrays with same size

    userTokens.map may contain one true value
    */
    const matchedIndex = comparosons.findIndex((match) => match === true);

    if (matchedIndex === -1)
      return next(new HTTPError(401, "Refresh Token not found"));

    const user = await User.findById(payload.userId);

    // Generate new access token
    const accessToken = jwt.sign(
      {
        userId: payload.userId,
        role: user.role,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXP,
      },
    );
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ message: "user authenticated", accessToken });
  } catch (err) {
    next(err);
  }
};
