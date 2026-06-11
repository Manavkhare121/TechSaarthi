import { Notice } from "../models/notice.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.service.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const uploadNotice = asyncHandler(async (req, res) => {
  const { title } = req.body;

  const localFilePath = req.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, "Document file is required");
  }

  const uploadedFile = await uploadOnCloudinary(localFilePath);

  if (!uploadedFile) {
    throw new ApiError(500, "File upload failed");
  }

  const notice = await Notice.create({
    title,
    document: uploadedFile.secure_url,
    uploadedBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      notice,
      "Notice uploaded successfully"
    )
  );
});

const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find()
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      notices,
      "Notices fetched successfully"
    )
  );
});

export {
  uploadNotice,
  getAllNotices,
};