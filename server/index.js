// server/index.js
// const express = require('express');
// const http = require('http');
// const { Server } = require("socket.io");
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Load environment variables from the root .env file
// dotenv.config({ path: '../.env' });

// // Connect to MongoDB database
// connectDB();

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.io with CORS configuration
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173", 
//         methods: ["GET", "POST"]
//     }
// });

// // Express Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // To parse JSON bodies

// // API Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/buses', require('./routes/busRoutes'));
// app.use('/api/routes', require('./routes/routeRoutes'));

// // A simple test route to confirm the server is running
// app.get('/api', (req, res) => {
//   res.json({ message: 'Welcome to the Delhi Bus Project API!' });
// });

// // Socket.io connection logic
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Listen for location updates from a driver's client
//     socket.on('updateLocation', (data) => {
//         // 'data' should contain { busId: '...', location: { lat: ..., lng: ... } }
        
//         // Broadcast the new location to all connected passenger clients
//         io.emit('locationUpdate', data);
//         console.log(`Location update for bus ${data.busId}:`, data.location);
//     });

//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

///
// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import "./auth/google.js";   // import strategy

// const app = express();

// app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());
// app.use(passport.session());

// // Route to start Google login
// app.get("/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // Callback after login
// app.get("/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     res.redirect("http://localhost:3000/dashboard");
//   }
// );

// app.listen(5000, () => console.log("Server running on port 5000"));


/////

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";  // note the .js extension in ESM

// Load environment variables
dotenv.config({ path: "../.env" });

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./routes/authRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);

// Test route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Delhi Bus Project API!" });
});

// Socket.io
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("updateLocation", (data) => {
    io.emit("locationUpdate", data);
    console.log(`Location update for bus ${data.busId}:`, data.location);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
