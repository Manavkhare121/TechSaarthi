import { Router } from "express";

import {
  uploadNotice,
  getAllNotices,
} from "../controller/notice.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { uploadMiddleware } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/upload-notice").post(
  verifyJWT,

  uploadMiddleware.single("document"),

  uploadNotice
);


router.route("/all-notices").get(
  getAllNotices
);

export default router;
