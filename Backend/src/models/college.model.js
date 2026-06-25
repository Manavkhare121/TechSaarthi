import mongoose from "mongoose";
import { Schema } from "mongoose";

const collegeSchema = new Schema(
  {
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
      required: true,

      enum: ["Government", "Private", "Deemed"],
    },
    departmentName: {
      type: String,
    },
    jeeCutoff: {
      type: Number,
    },
    cuetCutoff: {
      type: Number,
    },
    class12Cutoff: {
      type: Number,
    },
    fees: {
      type: Number,
    },
    hostelAvailable: {
      type: Boolean,
      default: false,
    },
    hostelFees: {
      type: Number,
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
    collegePhone: {
      type: String,
      required: true,
      trim: true,
    },

    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },

    scholarshipDetails: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationDate: {
      type: Date,
    },
    performanceScore: {
      type: Number,
    },
    rank: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  {
    timestamps: true,
  }
);

collegeSchema.statics.findMatchingColleges = async function (criteria) {
  const query = { verified: true };
  const andConditions = [];

  if (criteria.jeeCutoff !== null && criteria.jeeCutoff !== undefined) {
    andConditions.push({
      $or: [
        { jeeCutoff: { $lte: criteria.jeeCutoff } },
        { jeeCutoff: { $exists: false } },
        { jeeCutoff: null },
      ],
    });
  }

  if (criteria.cuetCutoff !== null && criteria.cuetCutoff !== undefined) {
    andConditions.push({
      $or: [
        { cuetCutoff: { $lte: criteria.cuetCutoff } },
        { cuetCutoff: { $exists: false } },
        { cuetCutoff: null },
      ],
    });
  }

  if (
    criteria.class12Percentage !== null &&
    criteria.class12Percentage !== undefined
  ) {
    andConditions.push({
      $or: [
        { class12Cutoff: { $lte: criteria.class12Percentage } },
        { class12Cutoff: { $exists: false } },
        { class12Cutoff: null },
      ],
    });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  if (criteria.state) {
    const stateMap = {
      up: ["UP", "Uttar Pradesh", "uttar pradesh"],
      "uttar pradesh": ["UP", "Uttar Pradesh", "uttar pradesh"],
      mp: ["MP", "Madhya Pradesh", "madhya pradesh"],
      "madhya pradesh": ["MP", "Madhya Pradesh", "madhya pradesh"],
      delhi: ["Delhi", "DL", "New Delhi"],
      dl: ["Delhi", "DL", "New Delhi"],
      rajasthan: ["Rajasthan", "RJ"],
      rj: ["Rajasthan", "RJ"],
      bihar: ["Bihar", "BR"],
      maharashtra: ["Maharashtra", "MH"],
      mh: ["Maharashtra", "MH"],
      gujarat: ["Gujarat", "GJ"],
      karnataka: ["Karnataka", "KA"],
      "tamil nadu": ["Tamil Nadu", "TN"],
      tn: ["Tamil Nadu", "TN"],
      "west bengal": ["West Bengal", "WB"],
      wb: ["West Bengal", "WB"],
    };

    const userState = criteria.state.toLowerCase();
    const possibleValues = stateMap[userState] || [criteria.state];

    const stateRegex = possibleValues
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    query.state = { $regex: stateRegex, $options: "i" };
  }

  if (criteria.collegeType) {
    query.collegeType = { $regex: `^${criteria.collegeType}$`, $options: "i" };
  }

  // Department filter
  if (criteria.departmentName) {
    query.departmentName = { $regex: criteria.departmentName, $options: "i" };
  }

  console.log("[TechSaarthi] MongoDB query:", JSON.stringify(query, null, 2));

  const colleges = await this.find(query)
    .select(
      "collegeName state location collegeType departmentName jeeCutoff cuetCutoff class12Cutoff fees hostelAvailable hostelFees boysHostel girlsHostel messAvailable rank performanceScore"
    )
    .sort({ rank: 1, performanceScore: -1 })
    .limit(5);

  console.log(
    "[TechSaarthi] Colleges found:",
    colleges.length,
    colleges.map((c) => c.collegeName)
  );

  return colleges;
};

export const College = mongoose.model("College", collegeSchema);
