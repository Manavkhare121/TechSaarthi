import { Router } from "express";

import {
  getEligibleColleges,
} from "../controller/user.controller.js";

const router = Router();

router.route("/eligible-colleges").post(
  getEligibleColleges
);

export default router;