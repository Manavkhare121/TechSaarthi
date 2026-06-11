import { College } from "../models/college.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCollege = asyncHandler(async (req, res) => {
  const {
    collegeName,
    state,
    location,
    collegeType,

    departmentName,

    jeeCutoff,
    cuetCutoff,
    class12Cutoff,

    fees,

    hostelAvailable,
    hostelFees,

    boysHostel,
    girlsHostel,

    messAvailable,
  } = req.body;

  if (!collegeName || !state || !location || !collegeType) {
    throw new ApiError(400, "Required college fields are missing");
  }

  const college = await College.create({
    collegeName,
    state,
    location,
    collegeType,

    departmentName,

    jeeCutoff,
    cuetCutoff,
    class12Cutoff,

    fees,

    hostelAvailable,
    hostelFees,

    boysHostel,
    girlsHostel,

    messAvailable,

    createdBy: req.user._id,
  });

  if (!college) {
    throw new ApiError(500, "Failed to create college");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      college,
      "College created successfully and waiting for government verification"
    )
  );
});

const getMyCollegeDetails = asyncHandler(async (req, res) => {
  const college = await College.findOne({
    createdBy: req.user._id,
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      college,
      "College details fetched successfully"
    )
  );
});

export {
  createCollege,
  getMyCollegeDetails,
};