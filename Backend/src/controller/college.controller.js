import { College } from "../models/college.model.js";



// Create College

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



// Get My College Details

const getMyCollegeDetails = async (req, res) => {

  try {

    const college = await College.findOne({

      createdBy: req.user._id,

    });

    if (!college) {

      return res.status(404).json({

        success: false,

        message: "College not found",

      });

    }

    return res.status(200).json({

      success: true,

      college,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

export {
  createCollege,
  getMyCollegeDetails,
};