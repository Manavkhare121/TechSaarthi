import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import {
  generateResponse,
  generateVectors,
  extractCollegeCriteria,
  detectLanguage,
} from "../services/ai.service.js";
import { messageModel } from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";
import { Auth } from "../models/auth.model.js";
import { College } from "../models/college.model.js";
import { chatmodel } from "../models/chat.model.js";   

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
    const token =
      socket.handshake.auth?.token || cookies.token || cookies.accessToken;

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userData = await Auth.findById(decoded._id).select(
        "-password -refreshToken"
      );

      if (!userData) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = userData;
      socket.role = userData.role;
      next();
    } catch (error) {
      console.error("[TechSaarthi] Socket auth error:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  
  io.on("connection", (socket) => {
    console.log("[TechSaarthi] User connected:", socket.user._id.toString());

    socket.on("ai-message", async (messagePayload) => {
      try {
        console.log("[TechSaarthi] Message received:", messagePayload.content);

        const [message, vectors, langResult] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
            content: messagePayload.content,
            role: "user",
          }),
          generateVectors(messagePayload.content),
          detectLanguage(messagePayload.content),  
        ]);

        const detectedLanguage = langResult.language;
        console.log("[TechSaarthi] Detected language:", detectedLanguage);

        await chatmodel.findByIdAndUpdate(messagePayload.chat, {
          preferredLanguage: detectedLanguage,
          lastActivity: new Date(),
        });

        await createMemory({
          vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id.toString(),
            text: messagePayload.content,
          },
        });

        const criteria = await extractCollegeCriteria(messagePayload.content);

        let response;

        if (criteria.isCollegeQuery) {
         
          const matchingColleges = await College.findMatchingColleges(criteria);

          
          let collegeContext = "";

          if (matchingColleges.length > 0) {
            const collegeList = matchingColleges
              .map((college, index) => {
                const hostelInfo = college.hostelAvailable
                  ? `Available (Boys: ${college.boysHostel ? "Yes" : "No"}, Girls: ${college.girlsHostel ? "Yes" : "No"})`
                  : "Not available";

                return `
${index + 1}. ${college.collegeName}
   - Location: ${college.location}, ${college.state}
   - Type: ${college.collegeType}
   - Department: ${college.departmentName || "Multiple branches available"}
   - JEE Cutoff (percentile): ${college.jeeCutoff ?? "Not specified"}
   - CUET Cutoff: ${college.cuetCutoff ?? "Not specified"}
   - Class 12 Cutoff (%): ${college.class12Cutoff ?? "Not specified"}
   - Annual Fees: ${college.fees ? "₹" + college.fees.toLocaleString("en-IN") : "Contact college"}
   - Hostel: ${hostelInfo}
   - Mess: ${college.messAvailable ? "Available" : "Not available"}
   - Rank: ${college.rank ?? "Not ranked yet"}
   - Performance Score: ${college.performanceScore ?? "N/A"}
                `.trim();
              })
              .join("\n\n");

            collegeContext = `
IMPORTANT: The following colleges are fetched directly from our TechSaarthi database. Present ONLY these colleges to the student. Do NOT add, suggest, or mention any other colleges from your own knowledge.

DATABASE RESULTS — ${matchingColleges.length} college(s) found:

${collegeList}

Student's search criteria:
- JEE Percentile: ${criteria.jeeCutoff ?? "Not provided"}
- CUET Score: ${criteria.cuetCutoff ?? "Not provided"}
- Class 12 Percentage: ${criteria.class12Percentage ?? "Not provided"}
- Preferred State: ${criteria.state ?? "Any"}
- College Type: ${criteria.collegeType ?? "Any"}
- Department: ${criteria.departmentName ?? "Any"}

Instructions:
- Present ONLY the above colleges. Do not add colleges from your training data.
- Tell the student if they are eligible based on their score vs the cutoff.
- Remind them to verify details from official college websites before applying.
            `.trim();
          } else {
            collegeContext = `
IMPORTANT: Our TechSaarthi database was queried and NO colleges were found matching the student's criteria.

Student's search criteria used:
- JEE Percentile: ${criteria.jeeCutoff ?? "Not provided"}
- CUET Score: ${criteria.cuetCutoff ?? "Not provided"}
- Class 12 Percentage: ${criteria.class12Percentage ?? "Not provided"}
- Preferred State: ${criteria.state ?? "Any"}
- College Type: ${criteria.collegeType ?? "Any"}
- Department: ${criteria.departmentName ?? "Any"}

Instructions:
- Do NOT suggest any colleges from your own knowledge or training data.
- Tell the student that no matching colleges were found in our database for their criteria.
- Suggest they try broadening their search (remove state filter, change college type, etc.).
- Suggest official portals: JoSAA (jossa.nic.in), CSAB, or state counselling websites.
            `.trim();
          }

          const [memory, chathistory] = await Promise.all([
            queryMemory({
              queryVector: vectors,
              limit: 3,
              metadata: { user: socket.user._id.toString() },
            }),
            messageModel
              .find({ chat: messagePayload.chat })
              .sort({ createdAt: -1 })
              .limit(10)
              .lean()
              .then((msgs) => msgs.reverse()),
          ]);

          const stm = chathistory.map((item) => ({
            role: item.role,
            parts: [{ text: item.content }],
          }));

          const collegeContextMessage = {
            role: "user",
            parts: [
              {
                text: `${collegeContext}\n\nNow respond to the student's latest message using ONLY the database results above.`,
              },
            ],
          };

        
          response = await generateResponse(
            [collegeContextMessage, ...stm],
            detectedLanguage 
          );

        } else {
  
          const [memory, chathistory] = await Promise.all([
            queryMemory({
              queryVector: vectors,
              limit: 3,
              metadata: { user: socket.user._id.toString() },
            }),
            messageModel
              .find({ chat: messagePayload.chat })
              .sort({ createdAt: -1 })
              .limit(20)
              .lean()
              .then((msgs) => msgs.reverse()),
          ]);

          const stm = chathistory.map((item) => ({
            role: item.role,
            parts: [{ text: item.content }],
          }));

          const ltm = [
            {
              role: "user",
              parts: [
                {
                  text: `These are some relevant previous messages from past conversations, use them for context:\n\n${memory
                    .map((item) => item.metadata.text)
                    .join("\n")}`,
                },
              ],
            },
          ];

  
          response = await generateResponse(
            [...ltm, ...stm],
            detectedLanguage   // ← language passed here
          );
        }

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
          language: detectedLanguage,  
        });

        const [responseMessage, responseVectors] = await Promise.all([
          messageModel.create({
            chat: messagePayload.chat,
            user: socket.user._id,
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
            user: socket.user._id.toString(),
            text: response,
          },
        });

      } catch (error) {
        console.error("[TechSaarthi] ai-message error:", error);
        socket.emit("ai-error", {
          message: "Something went wrong. Please try again.",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("[TechSaarthi] User disconnected:", socket.user._id.toString());
    });
  });
}

export default initSocketServer;