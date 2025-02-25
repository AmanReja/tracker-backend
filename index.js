const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
const cors = require("cors");
const port = 3000;

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.emit("welcome", "Welcome to the server!");
  socket.on("geolocation", (location) => {
    console.log("received geo from clint", location);
    socket.broadcast.emit("location-update", location);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
