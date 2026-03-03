import User from "../models/user.js";
import HTTPError from "../util/httpError.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    // user with _id from database

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    next(err);
  }
};

// admin
//TODO: hide user password from return
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

// admin
//TODO: hide user password from return
export const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return next(new HTTPError(404,"User not found"));
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//TODO: hide user password from return
export const updateUser = async (req, res, next) => {
  try {
    // update name and email
    const { name, email } = req.body;
    const id = req.params.id;

    //const user = await User.findByIdAndUpdate()
    const user = await User.findById(id);
    if (!user) {
      return next(new HTTPError(404,"User not found"));
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    return res.status(200).json({
      message: "user updated",
      user,
    });
  } catch (err) {
    next(err);
  }
};

//TODO: implement update password
export const updatePassword = async (req, res, next) => {};

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return next(new HTTPError(404, "User not found"));
    }
    await user.deleteOne();
    return res.status(200).json({
      message: "user deleted",
    });
  } catch (err) {
    next(err);
  }
};
