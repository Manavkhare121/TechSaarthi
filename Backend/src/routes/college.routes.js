import { Router } from "express";

import {

  createCollege,
  getMyCollegeDetails,

} from "../controller/college.controller.js";

import {
  verifyJWT,
} from "../middleware/auth.middleware.js";

const router = Router();




router.route("/create-college").post(
  verifyJWT,
  createCollege
);


router.route("/my-college").get(
  verifyJWT,
  getMyCollegeDetails
);

export default router;