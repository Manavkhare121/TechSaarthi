import mongoose from "mongoose";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
// import { User } from "../models/user.model.js";
// import { Counsellor } from "../models/counsellor.models.js";
// import { Admin } from "../models/admin.model.js";
// import { generateResponse, generateVectors } from "../services/ai.service.js";
// import { messageModel } from "../models/message.model.js";
// import { createMemory, queryMemory } from "../services/vector.service.js";
// import { chatmodel } from "../models/chatbot.model.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });

  // io.use(async (socket, next) => {
  //   const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

  //   const token = socket.handshake.auth?.token || cookies.accessToken;

  //   if (!token) {
  //     return next(new Error("Authentication error: No token Provided"));
  //   }

  //   try {
  //     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //     let userData = null;
   
  //     if (decoded.role === "user") {
  //       userData = await User.findById(decoded._id);
  //       socket.user = userData;
  //     } else if (decoded.role === "counsellor") {
  //       userData = await Counsellor.findById(decoded._id);
  //       socket.counsellor = userData;
  //     } else if (decoded.role === "admin") {
  //       userData = await Admin.findById(decoded._id);
  //       socket.admin = userData;
  //     }

  //     if (!userData) {
  //       return next(new Error("Authentication error: User not found"));
  //     }

  //     socket.role = decoded.role;
  //     next();
  //   } catch (error) {
  //     next(new Error("Authentication error: Invalid token"));
  //   }
  // });

  // io.on("connection", (socket) => {

   
  //   socket.on("ai-message", async (messagePayload) => {
  //     // AI chatbot processing
  //     const [message, vectors] = await Promise.all([
  //       messageModel.create({
  //         chat: messagePayload.chat,
  //         sender: socket.user._id, 
  //         content: messagePayload.content,
  //         role: "user",
  //       }),
  //       generateVectors(messagePayload.content),
  //     ]);

  //     await createMemory({
  //       vectors,
  //       messageId: message._id,
  //       metadata: {
  //         chat: messagePayload.chat,
  //         user: socket.user._id,
  //         text: messagePayload.content,
  //       },
  //     });

  //     const [memory, chathistory] = await Promise.all([
  //       queryMemory({
  //         queryVector: vectors,
  //         limit: 3,
  //         metadata: { user: socket.user._id },
  //       }),
  //       messageModel
  //         .find({ chat: messagePayload.chat })
  //         .sort({ createdAt: -1 })
  //         .limit(20)
  //         .lean()
  //         .then((messages) => messages.reverse()),
  //     ]);

  //     const stm = chathistory.map((item) => {
  //       return { role: item.role, parts: [{ text: item.content }] };
  //     });

  //     const ltm = [
  //       {
  //         role: "user",
  //         parts: [
  //           {
  //             text: `these are some previous messages from the chat, use them to generate a response\n\n${memory.map((item) => item.metadata.text).join("\n")}`,
  //           },
  //         ],
  //       },
  //     ];

  //     const response = await generateResponse([...ltm, ...stm]);

  //     socket.emit("ai-response", {
  //       content: response,
  //       chat: messagePayload.chat,
  //     });

  //     const [responseMessage, responseVectors] = await Promise.all([
  //       messageModel.create({
  //         chat: messagePayload.chat,
  //         sender: socket.user._id,
  //         content: response,
  //         role: "model",
  //       }),
  //       generateVectors(response),
  //     ]);

  //     await createMemory({
  //       vectors: responseVectors,
  //       messageId: responseMessage._id,
  //       metadata: {
  //         chat: messagePayload.chat,
  //         user: socket.user._id,
  //         text: response,
  //       },
  //     });
  //   });

  //   // ✅ FIXED: socket.server.js - join-chat aur send-message
  //   socket.on("join-chat", async (chatId) => {
  //     try {
  //       // 🚨 YEH HAI WOH MAGIC CODE JO CRASH ROKEGA 🚨
  //       if (!mongoose.Types.ObjectId.isValid(chatId)) {
  //         console.log("Frontend sent an invalid ID. Ignoring to prevent crash:", chatId);
  //         return; 
  //       }

  //       const chat = await chatmodel.findById(chatId);
  //       if (!chat) {
  //         console.log("Chat not found:", chatId);
  //         return;
  //       }

  //       const currentUser = socket.user || socket.counsellor || socket.admin;
  //       const currentId = currentUser?._id;

  //       if (!currentId) {
  //         console.log("No user on socket");
  //         return;
  //       }

  //       const isUserInChat = chat.users.some(
  //         (id) => id.toString() === currentId.toString()
  //       );

  //       if (!isUserInChat) {
  //         console.log("Access Denied for:", currentId);
  //         return;
  //       }

  //       socket.join(chatId.toString());
  //       console.log(`${socket.role} ${currentId} joined room: ${chatId}`);

  //       const chatHistory = await messageModel
  //         .find({ chat: chatId })
  //         .sort({ createdAt: 1 });
        
  //       socket.emit("chat-history", chatHistory);

  //     } catch (err) {
  //       console.error("Join Chat Error:", err);
  //     }
  //   });

  //   socket.on("send-message", async (payload) => {
  //     try {
  //       const chat = await chatmodel.findById(payload.chat);
  //       if (!chat) {
  //         console.log("Chat not found for sending message");
  //         return;
  //       }

  //       const currentId = (socket.user || socket.counsellor || socket.admin)?._id;

  //       const isUserInChat = chat.users.some(
  //         (id) => id.toString() === currentId.toString()
  //       );

  //       if (!isUserInChat) {
  //         console.log("Not allowed to send message here");
  //         return;
  //       }

  //       // ✅ Tumhare naye messageSchema ke hisaab se senderModel nikalna zaroori hai
  //       const senderModel =
  //         socket.role === "user"
  //           ? "User"
  //           : socket.role === "counsellor"
  //           ? "Counsellor"
  //           : "Admin";

  //       // ✅ DB mein message save karo
  //       const message = await messageModel.create({
  //         chat: payload.chat,
  //         sender: currentId,
  //         senderModel: senderModel, 
  //         content: payload.content,
  //         role: socket.role, 
  //       });

  //       // ✅ Room mein baithe DONO logon ko (User aur Counsellor) message bhej do!
  //       io.to(payload.chat.toString()).emit("receive-message", message);

  //     } catch (err) {
  //       console.error("Send Message Error:", err);
  //     }
  //   });
  // });
}

export default initSocketServer;