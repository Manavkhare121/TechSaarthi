import { chatmodel } from "../models/chat.model.js";
import { messageModel } from "../models/message.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createchat = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Chat title is required");
  }

  const user = req.user;

  const chat = await chatmodel.create({
    user: user._id,
    title,
  });

  if (!chat) {
    throw new ApiError(500, "Failed to create chat");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
      },
      "Chat created successfully"
    )
  );
});

const getChats = asyncHandler(async (req, res) => {
  const user = req.user;

  const chats = await chatmodel.find({
    user: user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      chats.map((chat) => ({
        _id: chat._id,
        title: chat.title,
        lastActivity: chat.lastActivity,
        user: chat.user,
      })),
      "Chats retrieved successfully"
    )
  );
});

const getMessages = asyncHandler(async (req, res) => {
  const chatId = req.params.id;

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      messages,
      "Messages retrieved successfully"
    )
  );
});

export {
  createchat,
  getChats,
  getMessages,
};