import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    preferredLanguage: {
      type: String,
      enum: ["english", "hindi", "marathi", "tamil", "telugu", "bengali", "gujarati", "kannada", "punjabi", "other"],
      default: "english",
    },
  },
  {
    timestamps: true,
  }
);

export const chatmodel = mongoose.model("chat", chatSchema);