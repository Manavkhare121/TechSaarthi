import { Router } from "express";
import {verifyJWT } from "../middleware/auth.middleware.js";
import {
  createchat,
  getChats,
  getMessages
} from "../controller/chatbot.controller.js";

const router = Router();


router.post("/", verifyJWT, createchat);


router.get("/", verifyJWT, getChats);


router.get("/messages/:id", verifyJWT, getMessages);

export default router;