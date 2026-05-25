import express from "express";

import { getEligibleColleges } from "../controller/user.controller.js";

const router = express.Router();

router.post(
  "/eligible-colleges",
  getEligibleColleges
);

export default router;