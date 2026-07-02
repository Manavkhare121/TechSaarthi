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

import {
  registerLimiter,
  loginLimiter,
  googleLimiter,
  logoutLimiter,
} from "../middleware/ratelimit.middleware.js";

const router = Router();

router.post(
  "/register",
  registerLimiter,
  validateRegister,
  registerUser
);

router.post(
  "/login",
  loginLimiter,
  validateLogin,
  loginUser
);

router.post(
  "/google",
  googleLimiter,
  googleLogin
);

router.post(
  "/logout",
  logoutLimiter,
  verifyJWT,
  logoutuser
);
export default router;