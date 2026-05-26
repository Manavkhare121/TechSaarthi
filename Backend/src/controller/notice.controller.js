import { Notice }
from "../models/notice.model.js";

import {
  uploadOnCloudinary,
}
from "../services/cloudinary.service.js";

const uploadNotice = async (
  req,
  res
) => {

  try {

    const { title } = req.body;

    // File Path

    const localFilePath =
      req.file?.path;
    if (!localFilePath) {

      return res.status(400).json({

        success: false,

        message:
          "Document file is required",

      });

    }

    // Upload to Cloudinary

    const uploadedFile =
      await uploadOnCloudinary(
        localFilePath
      );

    if (!uploadedFile) {

      return res.status(500).json({

        success: false,

        message:
          "File upload failed",

      });

    }

    // Save Notice

    const notice =
      await Notice.create({

        title,

        document:
          uploadedFile.secure_url,

        uploadedBy:
          req.user._id,

      });

    return res.status(201).json({

      success: true,

      message:
        "Notice uploaded successfully",

      notice,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};



// Get All Notices

const getAllNotices = async (
  req,
  res
) => {

  try {

    const notices =
      await Notice.find()

      .sort({
        createdAt: -1,
      });

    return res.status(200).json({

      success: true,

      notices,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};

export {

  uploadNotice,

  getAllNotices,

};