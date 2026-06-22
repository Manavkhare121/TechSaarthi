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

async function deleteChat(req, res) {
    const chatId = req.params.id;
    const userId = req.user._id;

    try {
        const chat = await chatmodel.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Broken chats (empty users) or owner can delete
        const isOwner = chat.users.length === 0 || chat.users.includes(userId);
        if (!isOwner) return res.status(403).json({ message: "Unauthorized" });

        await messageModel.deleteMany({ chat: chatId });
        await chatmodel.findByIdAndDelete(chatId);

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export {
  createchat,
  getChats,
  getMessages,
};