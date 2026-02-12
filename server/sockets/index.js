const spamDetectionService = require('../services/spamDetectionService');
const redisService = require('../services/redisService');
const User = require('../models/user');
const Message = require('../models/message');
const Stream = require('../models/stream');
const ModerationLog = require('../models/moderationLog');
const mongoose = require('mongoose');

// In-memory stores
const activeStreams = new Map();  // streamId -> { socketId, hlsUrl, mode }
const roomViewers = new Map();   // streamId -> Set of socketIds

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] Connected: ${socket.id}`);

        // ─── Join a stream room ──────────────────────
        socket.on('join_stream', (streamId) => {
            socket.join(streamId);
            
            // Track viewers per room
            if (!roomViewers.has(streamId)) {
                roomViewers.set(streamId, new Set());
            }
            roomViewers.get(streamId).add(socket.id);
            
            const viewerCount = roomViewers.get(streamId).size;
            io.to(streamId).emit('viewer_count', viewerCount);
            
            console.log(`[SOCKET] ${socket.id} joined ${streamId} (${viewerCount} viewers)`);

            // If there's an active stream, notify the new viewer
            const activeStream = activeStreams.get(streamId);
            if (activeStream) {
                socket.emit('stream_active', {
                    streamerId: activeStream.socketId,
                    hlsUrl: activeStream.hlsUrl,
                    mode: activeStream.mode  // 'browser' or 'hls'
                });
            }
        });

        // ─── Check block status ──────────────────────
        socket.on('check_block_status', async ({ userId }) => {
            const blocked = await redisService.isUserBlocked(userId);
            if (blocked) {
                socket.emit('blocked', { reason: 'ACCESS_RESTRICTED (TEMPORARY_MUTE)' });
            }
        });

        // ─── Streamer goes live (notifies viewers) ───
        socket.on('start_stream', async (data) => {
            const { streamId, userId, hlsUrl, mode } = data;
            
            activeStreams.set(streamId, {
                socketId: socket.id,
                userId,
                hlsUrl: hlsUrl || '',
                mode: mode || 'browser'
            });

            console.log(`[STREAM] Live: ${streamId} by ${userId} (mode: ${mode || 'browser'})`);

            // Notify all viewers in the room
            io.to(streamId).emit('stream_started', {
                hlsUrl,
                streamerId: socket.id,
                mode: mode || 'browser'
            });
        });

        // ─── Streamer ends stream ────────────────────
        socket.on('stop_stream', async (data) => {
            const { streamId } = data;
            activeStreams.delete(streamId);
            io.to(streamId).emit('stream_ended', { from: socket.id });
            console.log(`[STREAM] Ended: ${streamId}`);
        });

        // ───────────────────────────────────────────────
        //  WebRTC Signaling (Browser-based streaming)
        // ───────────────────────────────────────────────
        
        // Viewer requests the stream from the streamer
        socket.on('request_stream', ({ streamId, viewerId }) => {
            const activeStream = activeStreams.get(streamId);
            if (activeStream) {
                console.log(`[WEBRTC] Viewer ${viewerId} requesting stream from ${activeStream.socketId}`);
                // Tell the STREAMER to create an offer for THIS viewer
                io.to(activeStream.socketId).emit('viewer_joined', {
                    viewerId: viewerId || socket.id
                });
            }
        });

        // Streamer sends an SDP offer to a specific viewer
        socket.on('stream_offer', ({ offer, viewerId }) => {
            console.log(`[WEBRTC] Offer from streamer ${socket.id} → viewer ${viewerId}`);
            io.to(viewerId).emit('stream_offer', {
                offer,
                streamerId: socket.id
            });
        });

        // Viewer sends an SDP answer back to the streamer
        socket.on('stream_answer', ({ answer, streamerId }) => {
            console.log(`[WEBRTC] Answer from viewer ${socket.id} → streamer ${streamerId}`);
            io.to(streamerId).emit('stream_answer', {
                answer,
                viewerId: socket.id
            });
        });

        // ICE candidate exchange (both directions)
        socket.on('ice_candidate', ({ candidate, targetId }) => {
            io.to(targetId).emit('ice_candidate', {
                candidate,
                senderId: socket.id
            });
        });

        // ─── Send chat message ───────────────────────
        socket.on('send_message', async (data) => {
            const { userId, username, content, streamId, role } = data;

            try {
                // 1. Check if user is blocked (fast Redis check)
                const isBlocked = await redisService.isUserBlocked(userId);
                if (isBlocked) {
                    socket.emit('blocked', { reason: 'ACCESS_REVOKED' });
                    return;
                }

                // 2. Check persistent block in DB
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    const user = await User.findById(userId);
                    if (user && user.isBlocked) {
                        socket.emit('error', 'Your account has been blocked.');
                        return;
                    }
                }

                // 3. Track message history for spam detection
                const history = await redisService.trackMessage(userId, content);

                // 4. Run spam detection
                const detection = spamDetectionService.detect(content, history.slice(1));
                
                if (detection.spam) {
                    await redisService.blockUser(userId);
                    if (mongoose.Types.ObjectId.isValid(userId)) {
                        await User.findByIdAndUpdate(userId, { isBlocked: true });
                    }
                    await ModerationLog.create({
                        userId,
                        reason: detection.reason,
                        action: 'TEMPORARY_MUTE',
                        details: `Spam: ${content}. Muted 5 minutes.`
                    });
                    io.emit('user_blocked', { userId, username, reason: detection.reason, duration: '5m' });
                    socket.emit('blocked', { reason: detection.reason, duration: 300 });
                    return;
                }

                // 5. Save and broadcast message
                const newMessage = await Message.create({
                    userId, username, content, streamId,
                    role: role || 'viewer',
                    timestamp: new Date()
                });

                io.to(streamId).emit('receive_message', newMessage);
            } catch (err) {
                console.error("Message Error:", err);
            }
        });

        // ─── Delete message (moderator) ──────────────
        socket.on('delete_message', async ({ messageId, streamId }) => {
            try {
                await Message.findByIdAndDelete(messageId);
                io.to(streamId).emit('message_deleted', messageId);
            } catch (err) {
                console.error("Delete Error:", err);
            }
        });

        // ─── Emoji reactions ─────────────────────────
        socket.on('send_reaction', ({ emoji, streamId }) => {
            io.to(streamId).emit('receive_reaction', { emoji, id: Date.now() });
        });

        // ─── Disconnect ──────────────────────────────
        socket.on('disconnect', () => {
            console.log(`[SOCKET] Disconnected: ${socket.id}`);

            // Remove from viewer counts
            for (let [streamId, viewers] of roomViewers.entries()) {
                if (viewers.has(socket.id)) {
                    viewers.delete(socket.id);
                    io.to(streamId).emit('viewer_count', viewers.size);
                }
            }

            // If streamer disconnected, end their streams
            for (let [streamId, data] of activeStreams.entries()) {
                if (data.socketId === socket.id) {
                    activeStreams.delete(streamId);
                    io.to(streamId).emit('stream_ended', { from: socket.id });
                }
            }
        });
    });
};
