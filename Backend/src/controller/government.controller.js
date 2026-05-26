import { College } from "../models/college.model.js";


// Get All Colleges

const getAllColleges = async (req, res) => {

  try {

    const colleges = await College.find();

    return res.status(200).json({

      success: true,

      colleges,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};



// Verify and Update College

const verifyCollege = async (req, res) => {

  try {

    const { collegeId } = req.params;

    const {

      verified,
      verificationDate,
      performanceScore,
      rank,

    } = req.body;

    const college = await College.findByIdAndUpdate(

      collegeId,

      {
        verified,
        verificationDate,
        performanceScore,
        rank,
      },

      {
        new: true,
      }

    );

    return res.status(200).json({

      success: true,

      message: "College updated successfully",

      updatedCollege: college,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

export {

  getAllColleges,

  verifyCollege,

};