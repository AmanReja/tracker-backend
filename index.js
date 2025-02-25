const express = require("express");
const http = require("http");
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

const activeUsers = {}; // Store users' locations

app.get("/", (req, res) => {
  res.send("hii");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("geolocation", (location) => {
    activeUsers[socket.id] = location; // Save location with socket ID
    io.emit("receive-location", activeUsers); // Broadcast all locations
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete activeUsers[socket.id]; // Remove user on disconnect
    io.emit("receive-location", activeUsers); // Send updated list
  });
});

server.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
