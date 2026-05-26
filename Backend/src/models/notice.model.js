import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(

  {
    title: {
      type: String,
      required: true,
    },

    document: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },

  {
    timestamps: true,
  }

);

export const Notice = mongoose.model(
  "Notice",
  noticeSchema
);