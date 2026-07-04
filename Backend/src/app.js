import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmetMiddleware from "./middleware/helmet.middleware.js";
import authRouter from "../src/routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import governmentRoutes from "./routes/government.routes.js";
import noticeRoutes from "./routes/notice.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import agentRoutes from "./routes/admission.routes.js";

const app = express();


app.use(helmetMiddleware);

app.use(cors({
  origin: [
      "http://localhost:5173",
      "https://techsaarthi-frontend.onrender.com",
      "https://techsaarthi.onrender.com"
    ],
  credentials: true,
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());


app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/college", collegeRoutes);

app.use("/api/v1/government", governmentRoutes);

app.use("/api/v1/notice", noticeRoutes);

app.use("/api/v1/chat", chatRoutes);

app.use("/api/v1/agent", agentRoutes);


export default app;