import mongoose from "mongoose";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { generateResponse, generateVectors } from "../services/ai.service.js";
import { messageModel } from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";
import { Auth } from "../models/auth.model.js"; // ✨ IMPORTED YOUR NEW AUTH MODEL

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    const token = socket.handshake.auth?.token || cookies.token || cookies.accessToken;

    if (!token) {
      return next(new Error("Authentication error: No token Provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      
      const userData = await Auth.findById(decoded._id).select("-password -refreshToken");

      if (!userData) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = userData;
      socket.role = userData.role; 
      
      next();
    } catch (error) {
      console.error("🔴 REAL SOCKET AUTH ERROR:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      // AI chatbot processing
      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          sender: socket.user._id, 
          content: messagePayload.content,
          role: "user",
        }),
        generateVectors(messagePayload.content),
      ]);

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      const [memory, chathistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: { user: socket.user._id },
        }),
        messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((messages) => messages.reverse()),
      ]);

      const stm = chathistory.map((item) => {
        return { role: item.role, parts: [{ text: item.content }] };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `these are some previous messages from the chat, use them to generate a response\n\n${memory.map((item) => item.metadata.text).join("\n")}`,
            },
          ],
        },
      ];

      const response = await generateResponse([...ltm, ...stm]);

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });

      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          sender: socket.user._id,
          content: response,
          role: "model",
        }),
        generateVectors(response),
      ]);

      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

export default initSocketServer;