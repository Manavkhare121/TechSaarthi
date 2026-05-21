import dotenv from "dotenv"
import http from "http";
import app from "./app.js"
import connectDB from "./db/db.js"
import initSocketServer from "./sockets/socket.server.js";
dotenv.config({
    path:"./.env"
})
const httpServer= http.createServer(app);
initSocketServer(httpServer);
connectDB().then(()=>{
    httpServer.listen(process.env.PORT || 3000,()=>{
        console.log(`server is running at port:${process.env.PORT}`)
    })
})
.catch((error)=>{
        console.log("MONGODB coneection is faild !!!",error)
})