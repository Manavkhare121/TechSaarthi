import { College } from "../models/college.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getEligibleColleges = asyncHandler(async (req, res) => {
  const {
    jeePercentile,
    cuetPercentile,
    class12Marks,
    preferredDepartment,
  } = req.body;

  if (
    jeePercentile === undefined ||
    cuetPercentile === undefined ||
    class12Marks === undefined ||
    !preferredDepartment
  ) {
    throw new ApiError(
      400,
      "All eligibility criteria are required"
    );
  }

  const colleges = await College.find({
    verified: true,
    departmentName: preferredDepartment,
    jeeCutoff: { $lte: jeePercentile },
    cuetCutoff: { $lte: cuetPercentile },
    class12Cutoff: { $lte: class12Marks },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "Eligible colleges fetched successfully"
    )
  );
});

export { getEligibleColleges };