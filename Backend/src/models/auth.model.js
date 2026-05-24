import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    role: {
      type: String,
      enum: ["user", "college", "government"],
      default: "user",
    },

    refreshToken: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

authSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
  

});

authSchema.methods.isPasswordCorrect = async function (password) {

  return await bcrypt.compare(password, this.password);

};

authSchema.methods.generateAccessToken = function () {

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },

    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

authSchema.methods.generateRefreshToken = function () {

  return jwt.sign(
    {
      _id: this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,

    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Auth = mongoose.model("Auth", authSchema);