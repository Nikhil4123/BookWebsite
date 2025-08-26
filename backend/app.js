const express = require("express");
const http = require("http");
const cors=require("cors");
require("dotenv").config();
require("./conn/conn");

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
    }
});

// Basic presence map
const onlineUsers = new Map();
io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            io.emit("presence:update", { userId, online: true });
        }
    });

    socket.on("disconnect", () => {
        for (const [userId, sid] of onlineUsers.entries()) {
            if (sid === socket.id) {
                onlineUsers.delete(userId);
                io.emit("presence:update", { userId, online: false });
                break;
            }
        }
    });
});

// Expose io and presence to routes via app locals
app.locals.io = io;
app.locals.onlineUsers = onlineUsers;

const User =require("./routes/user.js");
const Book =require("./routes/book.js")
const Favorite =require("./routes/favorite");
const cart=require("./routes/cart");
const Order=require("./routes/order");
const Social=require("./routes/social");
const Chat=require("./routes/chat");
const Blog=require("./routes/blog");
const Post=require("./routes/post");
const Notification=require("./routes/notification");
const Market=require("./routes/market");

app.use(cors({origin:"*"}));
app.use(express.json());

app.get("/",(req,res) => {
    res.send("hello from backend ")
});

app.use("/api/v1",User);
app.use("/api/v1",Book);
app.use("/api/v1",Favorite);
app.use("/api/v1",cart);
app.use("/api/v1",Order);
app.use("/api/v1",Social);
app.use("/api/v1",Chat);
app.use("/api/v1",Blog);
app.use("/api/v1",Post);
app.use("/api/v1",Notification);
app.use("/api/v1",Market);

server.listen(process.env.PORT || 5000,()=>{
    console.log(`server Started at ${process.env.PORT || 5000}`);
})