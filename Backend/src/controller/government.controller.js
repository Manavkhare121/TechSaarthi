import { College } from "../models/college.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllColleges = asyncHandler(async (req, res) => {
  const colleges = await College.find();

  return res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "All colleges fetched successfully"
    )
  );
});

const verifyCollege = asyncHandler(async (req, res) => {
  const { collegeId } = req.params;

  const {
    verified,
    verificationDate,
    performanceScore,
    rank,
  } = req.body;

  const college = await College.findById(collegeId);

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const updatedCollege = await College.findByIdAndUpdate(
    collegeId,
    {
      verified,
      verificationDate,
      performanceScore,
      rank,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedCollege,
      "College updated successfully"
    )
  );
});

export {
  getAllColleges,
  verifyCollege,
};