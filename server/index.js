// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from the root .env file
dotenv.config({ path: '../.env' });

// Connect to MongoDB database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"]
    }
});
app.set('io' ,io);

// Express Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: false })); // to parse Twilio/GSM form data

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));

app.use('/sms' , require('./routes/smsRoutes'));
app.use('/api/location' , require("./routes/locationRoutes"))
app.use('/api/buses' , require("./routes/liveRoutes"))


// A simple test route to confirm the server is running
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Delhi Bus Project API!' });
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for location updates from a driver's client
    socket.on('updateLocation', (data) => {
        // 'data' should contain { busId: '...', location: { lat: ..., lng: ... } }
        
        // Broadcast the new location to all connected passenger clients
        io.emit('locationUpdate', data);
        console.log(`Location update for bus ${data.busId}:`, data.location);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));