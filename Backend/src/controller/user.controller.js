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

  // Validation
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

  // Frontend Department -> Database Department Mapping
  const departmentMap = {
    CSE: "Computer Science",
    "CSE-DS": "Computer Science DS",
    "CSE-AIML": "Computer Science AIML",
  };

  const actualDepartment =
    departmentMap[preferredDepartment] || preferredDepartment;

  console.log("Received Data:", {
    jeePercentile,
    cuetPercentile,
    class12Marks,
    preferredDepartment,
    actualDepartment,
  });

  const colleges = await College.find({
    verified: true,
    departmentName: actualDepartment,
    jeeCutoff: { $lte: Number(jeePercentile) },
    cuetCutoff: { $lte: Number(cuetPercentile) },
    class12Cutoff: { $lte: Number(class12Marks) },
  });

  console.log("Matched Colleges:", colleges);

  return res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "Eligible colleges fetched successfully"
    )
  );
});

export { getEligibleColleges };