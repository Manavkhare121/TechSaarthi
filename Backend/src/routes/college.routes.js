import { Router } from "express";

import {
  createCollege,
  getMyCollegeDetails,
  searchColleges,
} from "../controller/college.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-college").post(verifyJWT, createCollege);

router.route("/my-college").get(verifyJWT, getMyCollegeDetails);

router.route("/search").get(searchColleges);

export default router;
