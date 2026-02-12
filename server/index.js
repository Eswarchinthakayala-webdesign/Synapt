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

// ─── CORS — Allow all origins ────────────────────
app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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

// ─── Start Server ────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`>>> Synapt Logic Core active on port ${PORT}`);
});

// RTMP only when explicitly enabled (not on Render)
if (process.env.ENABLE_RTMP === 'true') {
    try {
        const { createMediaServer, HLS_OUTPUT_DIR } = require('./services/mediaServer');
        app.use('/live', express.static(HLS_OUTPUT_DIR, {
            setHeaders: (res) => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Cache-Control', 'no-cache');
            }
        }));
        const mediaServer = createMediaServer();
        mediaServer.run();
        console.log('>>> RTMP Server active on port 1935');
    } catch (err) {
        console.warn('>>> RTMP skipped:', err.message);
    }
}
