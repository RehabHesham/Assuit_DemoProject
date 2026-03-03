import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  // contains attributes of the user
  name: {
    type: String,
    minlength: [3, "Name must be more than 3 characters"],
    maxlength: [50, "Name can't be more than 50 character"],
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true, // run at database level
    validate: {
      validator: function (value) {
        return /^[a-z]*@[a-z]{3,}.[a-z]{3}$/.test(value);
      },
      message: "Email should be like ali@gmail.com",
    },
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    minlength: [8, "password should be at least 8 char"],
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
