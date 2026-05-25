import express from "express";

import { createCollege } from "../controller/college.controller.js";

const router = express.Router();

router.post(
  "/create-college",
  createCollege
);

export default router;