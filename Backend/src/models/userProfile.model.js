import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    jeePercentile: {
      type: Number,
      required: true,
    },

    cuetPercentile: {
      type: Number,
      required: true,
    },

    class12Marks: {
      type: Number,
      required: true,
    },

    preferredDepartment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model(
  "UserProfile",
  userProfileSchema
);