import express from "express"
import cookieParser from "cookie-parser" 
import cors from "cors"
import authRouter from "../src/routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import governmentRoutes from "./routes/government.routes.js";
import noticeRoutes from "./routes/notice.routes.js"
import chatRoutes from "./routes/chat.routes.js"
const app=express()
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/college", collegeRoutes);
app.use("/api/v1/government", governmentRoutes);
app.use("/api/v1/notice",noticeRoutes)
app.use("/api/v1/chat",chatRoutes)
export default app;