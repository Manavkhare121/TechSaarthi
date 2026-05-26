// models/college.model.js

import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    // College Information

    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    collegeType: {
      type: String,
      enum: ["Government", "Private"],
      required: true,
    },

    // Department Information

    departmentName: {
      type: String,
      required: true,
    },

    jeeCutoff: {
      type: Number,
      required: true,
    },

    cuetCutoff: {
      type: Number,
      required: true,
    },

    class12Cutoff: {
      type: Number,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    // Hostel Information

    hostelAvailable: {
      type: Boolean,
      default: false,
    },

    hostelFees: {
      type: Number,
      default: 0,
    },

    boysHostel: {
      type: Boolean,
      default: false,
    },

    girlsHostel: {
      type: Boolean,
      default: false,
    },

    messAvailable: {
      type: Boolean,
      default: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verificationDate: {
      type: Date,
      default: null,
    },

    performanceScore: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const College = mongoose.model("College", collegeSchema);
