import { Router } from "express";
import {verifyJWT } from "../middleware/auth.middleware.js";
import {
  createchat,
  getChats,
  getMessages,
  deleteChat,
  updateChatTitle
} from "../controller/chatbot.controller.js";

const router = Router();


router.post("/", verifyJWT, createchat);


router.get("/", verifyJWT, getChats);

router.delete("/:id", verifyJWT, deleteChat);
router.get("/messages/:id", verifyJWT, getMessages);
router.put("/:id", verifyJWT, updateChatTitle);
export default router;