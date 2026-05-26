import { v2 as cloudinary } from "cloudinary";

import fs from "fs";
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})

// Cloudinary Config

cloudinary.config({

  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,
    

});



// Upload File

export const uploadOnCloudinary = async (
  localFilePath
) => {

  try {

    if (!localFilePath) return null;

    const response =
      await cloudinary.uploader.upload(

        localFilePath,

        {

          resource_type: "auto",

          // Fixed Folder

          folder:
            "TechSaarthi/Notices",

        }

      );

    // Remove local file after upload

    if (fs.existsSync(localFilePath)) {

      fs.unlinkSync(localFilePath);

    }

    return response;

  } catch (error) {

    // Remove local file if error

    if (fs.existsSync(localFilePath)) {

      fs.unlinkSync(localFilePath);

    }

    return null;

  }

};



// Delete File

export const deleteFromCloudinary =
  async (publicUrl) => {

    try {

      if (!publicUrl) return null;

      const publicId = publicUrl

        .split("/")

        .slice(-2)

        .join("/")

        .split(".")[0];

      await cloudinary.uploader.destroy(
        publicId
      );

    } catch (error) {

      console.log(
        "Cloudinary Delete Error:",
        error.message
      );

    }

};