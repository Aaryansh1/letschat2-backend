var express = require("express");
var usersRouter = require("./routes/users");
var indexRouter = require("./routes/index");
var app = express();
var cors = require("cors");
var http = require("http");
const { Server } = require("socket.io");
const chatOperationsPath = require("./dbOperations/chatOperations");
const chatOperations = new chatOperationsPath.chatOperations();
const uuid = require("node-uuid");
app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/", indexRouter);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("send_message",(data) => {
    console.log(`data`, data);
    let model = {
      id: uuid.v4(),
      user_id: data.sender_id,
      sender_name:data.sender,
      room_name: data.room,
      message: data.message,
      timestamp:new Date().getTime()
    }
    let response = chatOperations.storeMessage(model);
    console.log(response);
    socket.to(data.room).emit("received_message", data);
  });
});

server.listen(4000, () => {
  console.log("Server started on port 4000");
});

module.exports = app;
