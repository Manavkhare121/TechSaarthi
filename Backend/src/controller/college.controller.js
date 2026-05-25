// controllers/college.controller.js

import { College } from "../models/college.model.js";

const createCollege = async (req, res) => {

  try {

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

    return res.status(201).json({

      success: true,

      message:
        "College created successfully and waiting for government verification",

      college,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

export { createCollege };