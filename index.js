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

const activeUsers = {}; // Store active users and their locations

app.get("/", (req, res) => {
  res.send("hii");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.emit("welcome", "Welcome to the server!");

  socket.on("geolocation", (location) => {
    activeUsers[socket.id] = location; // Update user location
    console.log("Received geo from client:", socket.id, location);

    io.emit("location-update", activeUsers); // Send updated locations to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete activeUsers[socket.id]; // Remove user from active list
    io.emit("location-update", activeUsers); // Notify others about the update
  });
});

server.listen(port, () => {
  console.log(`Server is running on :${port}`);
});
