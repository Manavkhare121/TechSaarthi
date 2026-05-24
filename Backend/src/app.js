import express from "express"
import cookieParser from "cookie-parser" 
import cors from "cors"
import authRouter from "../src/routes/auth.routes.js"
const app=express()
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use("/api/v1/auth", authRouter)

export default app;