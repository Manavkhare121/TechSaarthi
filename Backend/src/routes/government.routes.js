import express from "express";

import { verifyCollege } from "../controller/government.controller.js";

const router = express.Router();

router.patch(
  "/verify-college/:collegeId",
  verifyCollege
);

export default router;