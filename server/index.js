const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const socketHandler = require('./sockets');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Sockets
socketHandler(io);

// Routes
app.use('/api/moderation', require('./routes/moderation'));
app.use('/api/streams', require('./routes/streams'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`>>> Synapt Logic Core active on port ${PORT}`);
});
