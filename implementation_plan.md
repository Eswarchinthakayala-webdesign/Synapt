# Synapt — Live Streaming Platform with Anti-Spam Chat

## Architecture Overview

```
OBS (Streamer)
   ↓ RTMP (port 1935)
Node-Media-Server (RTMP Server)
   ↓ FFmpeg (auto-transcode)
HLS Stream (.m3u8 + .ts chunks)
   ↓ HTTP (port 8000)
React + Vite App (HLS.js player)
   ↓ Socket.IO (WebSockets)
Node.js + Express Server (port 5000)
   ↓
MongoDB + Redis
```

## Tech Stack

| Layer           | Tech                        |
| --------------- | --------------------------- |
| Frontend        | React + Vite                |
| UI              | Tailwind CSS                |
| Video Streaming | RTMP + FFmpeg + HLS         |
| Video Player    | HLS.js                      |
| Real-time Chat  | Socket.IO                   |
| Backend         | Node.js + Express           |
| Database        | MongoDB (Atlas)             |
| Cache           | Redis (rate limit / spam)   |
| Auth            | JWT (bcrypt passwords)      |
| Streamer Tool   | OBS Studio                  |

## Backend Structure (`/server`)

```
server/
├── config/       → db.js (MongoDB connection)
├── middlewares/   → auth.js (JWT + role authorization)
├── models/        → user.js, message.js, stream.js, moderationLog.js
├── routes/        → auth.js, streams.js, moderation.js
├── services/      → mediaServer.js, spamDetectionService.js, redisService.js
├── sockets/       → index.js (Socket.IO event handlers)
└── index.js       → Main server entry point
```

## Frontend Structure (`/src`)

```
src/
├── context/       → AuthContext.jsx
├── layout/        → app-layout.jsx
├── pages/         → LandingPage, LoginPage, RegisterPage, LiveStream, StreamerDashboard
├── components/    → Navbar, Hero, Features, etc.
└── App.jsx        → Router (public + protected routes)
```

## Streaming Setup (OBS)

1. Download OBS Studio from https://obsproject.com
2. Go to **Settings → Stream**
3. Set **Service** = Custom
4. **Server**: `rtmp://localhost:1935/live`
5. **Stream Key**: Copy from Streamer Dashboard
6. Click **Start Streaming**

## Auth System

- JWT-based with bcrypt password hashing
- Roles: `viewer`, `streamer`, `moderator`
- Protected routes for streamer dashboard
- Chat requires authentication

## Anti-Spam / Moderation

- Redis-backed message rate tracking
- Spam detection: repetition, flood, similarity
- Auto-mute for 5 minutes on violation
- Moderator message deletion
- Real-time block notifications
