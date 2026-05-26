import { Router } from "express";

import {

  getAllColleges,
  verifyCollege,

} from "../controller/government.controller.js";

import {
  verifyJWT,
} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/all-colleges").get(
  verifyJWT,
  getAllColleges
);



router.route("/verify-college/:collegeId").patch(
  verifyJWT,
  verifyCollege
);

export default router;