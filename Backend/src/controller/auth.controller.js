import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Auth } from "../models/auth.model.js";
import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js";
import { OAuth2Client } from "google-auth-library";
const generateAccessandRefreshToken = async (userId) => {

  try {

    const user = await Auth.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {

    throw new ApiError(
      500,
      "Something went wrong while generating tokens"
    );

  }
};

const registerUser = asyncHandler(async (req, res) => {

  const { username, email, password, role } = req.body;

  

  const existedUser = await Auth.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await Auth.create({
    email,
    password,
    role,
    username: username.toLowerCase(),
  });

  const createdUser = await Auth.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user"
    );
  }
  return res.status(201).json(
    new ApiResponse(
      201,
      createdUser,
      "User registered successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {

  const { email, username, password } = req.body;

 
  const user = await Auth.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessandRefreshToken(user._id);

  const loggedinuser = await Auth.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedinuser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  // Verify Google Token
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(401, "Invalid Google token");
  }

  const {
    email,
    name,
    picture,
    sub,
  } = payload;

  // Check if user already exists
  let user = await Auth.findOne({ email });

  if (!user) {
    user = await Auth.create({
      username: name.replace(/\s+/g, "").toLowerCase(),
      email,
      password: "",
      role: "user",
      googleId: sub,
      avatar: picture,
      provider: "google",
    });
  }

  // Generate Tokens
  const { accessToken, refreshToken } =
    await generateAccessandRefreshToken(user._id);

  const loggedInUser = await Auth.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Google Login Successful"
      )
    );
});
const logoutuser = asyncHandler(async (req, res) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")
      ?.replace("Bearer ", "")
      .trim();

  await Auth.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  // Blacklist token in Redis
  if (accessToken) {
    const decoded = jwt.decode(accessToken);

    if (decoded?.exp) {
      const expiryTime =
        decoded.exp -
        Math.floor(Date.now() / 1000);

      if (expiryTime > 0) {
        await redisClient.set(
          accessToken,
          "blacklisted",
          "EX",
          expiryTime
        );
      }
    }
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {},
        "User logged out successfully"
      )
    );
});




export {
  generateAccessandRefreshToken,
  registerUser,
  loginUser,
  logoutuser,
  googleLogin
};