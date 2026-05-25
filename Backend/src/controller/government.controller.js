// controllers/government.controller.js

import { College } from "../models/college.model.js";

const verifyCollege = async (req, res) => {

  try {

    const { collegeId } = req.params;

    const college = await College.findByIdAndUpdate(

      collegeId,

      {
        verified: true,
        verificationDate: new Date(),
      },

      {
        new: true,
      }

    );

    return res.status(200).json({

      success: true,

      message: "College verified successfully",

      college,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

export { verifyCollege };