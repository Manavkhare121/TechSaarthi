import { Router } from "express";

import {
  createCollege,
  getMyCollegeDetails,
  searchColleges,
  updateCollege,
  deleteCollege
} from "../controller/college.controller.js";

import { verifyJWT,authorizeRoles} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create-college").post(verifyJWT, createCollege);

router.route("/my-college").get(verifyJWT, getMyCollegeDetails);

router.route("/search").get(searchColleges);

router
  .route("/update-college")
  .put(
    verifyJWT,
    authorizeRoles("college"),
    updateCollege
  );

// Delete Logged-in College
router
  .route("/delete-college")
  .delete(
    verifyJWT,
    authorizeRoles("college"),
    deleteCollege
  );

export default router;
