// controllers/user.controller.js

import { College } from "../models/college.model.js";

const getEligibleColleges = async (req, res) => {

  try {

    const {

      jeePercentile,
      cuetPercentile,
      class12Marks,
      preferredDepartment,

    } = req.body;

    const colleges = await College.find({

      verified: true,

      departmentName: preferredDepartment,

      jeeCutoff: {
        $lte: jeePercentile,
      },

      cuetCutoff: {
        $lte: cuetPercentile,
      },

      class12Cutoff: {
        $lte: class12Marks,
      },

    });

    return res.status(200).json({

      success: true,

      message: "Eligible colleges fetched successfully",

      colleges,

    });

  } catch (error) {

    return res.status(500).json({

      success: false,
      message: error.message,

    });

  }

};

export { getEligibleColleges };