const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const socketHandler = require('./sockets');
const { createMediaServer, HLS_OUTPUT_DIR } = require('./services/mediaServer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// ─── Middleware ───────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve HLS media files (the .m3u8 and .ts segments)
app.use('/live', express.static(HLS_OUTPUT_DIR, {
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// ─── Database Connection ─────────────────────────
connectDB();

// ─── Socket.IO ───────────────────────────────────
socketHandler(io);

// ─── REST API Routes ─────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/moderation', require('./routes/moderation'));
app.use('/api/streams', require('./routes/streams'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', service: 'Synapt Core', timestamp: new Date() });
});

// ─── Start Servers ───────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`>>> Synapt Logic Core active on port ${PORT}`);
});

// Start RTMP Media Server (separate from Express)
try {
    const mediaServer = createMediaServer();
    mediaServer.run();
    console.log('>>> RTMP Server active on port 1935');
    console.log('>>> HLS Server active on port 8000');
} catch (err) {
    console.warn('>>> RTMP Server failed to start:', err.message);
}
