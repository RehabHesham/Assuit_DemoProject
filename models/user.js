import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

// this method will run with
// User.create()   => create new user call user.save()
// when updateing  => get user then edit fields then call user.save()
userSchema.pre("save", async function () {
  // encrypting passowrd
  // used function keyword to have this referring to current user
  if (!this.isModified("password")) return;

  // new user object or old object with password modified
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword){
 const isMatched = await bcrypt.compare(candidatePassword,this.password);
 return isMatched;
}

export default mongoose.model("User", userSchema);
