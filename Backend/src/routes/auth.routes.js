import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutuser,
  googleLogin

} from "../controller/auth.controller.js";

import {
  verifyJWT,
} from "../middleware/auth.middleware.js";

import {
  validateRegister,
  validateLogin,
} from "../middleware/validator.middlware.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post(
  "/login",
  validateLogin,
  loginUser
);

router.post(
  "/logout",
  verifyJWT,
  logoutuser
);

router.post("/google", googleLogin);
export default router;