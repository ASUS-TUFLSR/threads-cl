import {Server} from "socket.io"
import http from 'http'
import express from 'express'


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials:true
    }
}); 

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
}

const userSocketMap = {} //userId : socketId

io.on("connection", (socket) => {
    console.log("user connected", socket.id);
    
    const userId = socket.handshake.query.userId;
    console.log("userId:",userId);
    
    if(userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }
    
    console.log("userSocketMap",userSocketMap);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    console.log("userSocketMap:", userSocketMap);

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

    });

});


export {io, server, app};