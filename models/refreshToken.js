import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

refreshTokenSchema.pre("save", async function () {
  if (!this.isModified("token")) return;
  this.token = await bcrypt.hash(this.token, 11);
});

refreshTokenSchema.methods.compareToken = async function (reqToken) {
  return await bcrypt.compare(reqToken, this.token);
};
export default model("RefreshToken", refreshTokenSchema);
