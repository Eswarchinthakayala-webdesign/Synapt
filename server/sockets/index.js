const spamDetectionService = require('../services/spamDetectionService');
const redisService = require('../services/redisService');
const User = require('../models/user');
const Message = require('../models/message');
const ModerationLog = require('../models/moderationLog');
const mongoose = require('mongoose');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] Handshake Successful: ${socket.id}`);

        socket.on('join_stream', (streamId) => {
            socket.join(streamId);
            console.log(`[SOCKET] ${socket.id} joined channel: ${streamId}`);
        });

        socket.on('check_block_status', async ({ userId }) => {
            const blocked = await redisService.isUserBlocked(userId);
            if (blocked) {
                socket.emit('blocked', { reason: 'ACCESS_RESTRICTED (TEMPORARY_MUTE)' });
            }
        });

        socket.on('send_message', async (data) => {
            console.log(`[SOCKET] Incoming Thought from ${data.username}:`, data.content);
            const { userId, username, content, streamId, role } = data;

            try {
                // 1. Check if user is blocked in Redis (Fast check)
                const isSlowBlocked = await redisService.isUserBlocked(userId);
                if (isSlowBlocked) {
                    socket.emit('blocked', { reason: 'ACCESS_REVOKED' });
                    return;
                }

                // 2. Check if user is blocked in DB (Persistent check)
                if (mongoose.Types.ObjectId.isValid(userId)) {
                    const user = await User.findById(userId);
                    if (user && user.isBlocked) {
                        socket.emit('error', 'Your account has been blocked from chat.');
                        return;
                    }
                }

                // 3. Track message and get history from Redis/Fallback
                const history = await redisService.trackMessage(userId, content);

                // 4. Run Spam Detection (Temporarily enabled for everyone for testing)
                console.log(`[DEBUG] Checking spam for ${username} (Role: ${role}). History size: ${history.length - 1}`);
                
                const detection = spamDetectionService.detect(content, history.slice(1));
                
                if (detection.spam) {
                    console.log(`[DEBUG] Spam DETECTED for ${username}: ${detection.reason}`);
                    // Action: Block User
                    await redisService.blockUser(userId);
                        
                        if (mongoose.Types.ObjectId.isValid(userId)) {
                            await User.findByIdAndUpdate(userId, { isBlocked: true });
                        }
                        
                        await ModerationLog.create({
                            userId,
                            reason: detection.reason,
                            action: 'TEMPORARY_MUTE',
                            details: `Spam detected: ${content}. Muted for 5 minutes.`
                        });

                        // Broadcast to everyone
                        io.emit('user_blocked', { userId, username, reason: detection.reason, duration: '5m' });
                        
                        // Notify the specific user
                        socket.emit('blocked', { reason: detection.reason, duration: 300 });
                        console.warn(`[MODERATION] Muted ${username} for 5 minutes due to ${detection.reason}`);
                        return;
                }

                // 5. Save and broadcast message
                const newMessage = await Message.create({
                    userId,
                    username,
                    content,
                    streamId,
                    role: role || 'viewer',
                    timestamp: new Date()
                });

                console.log(`[SOCKET] Broadcasting message from ${username} to ${streamId}`);
                io.to(streamId).emit('receive_message', newMessage);

            } catch (err) {
                console.error("Socket Message Error:", err);
            }
        });

        socket.on('delete_message', async ({ messageId, streamId }) => {
            try {
                await Message.findByIdAndDelete(messageId);
                io.to(streamId).emit('message_deleted', messageId);
            } catch (err) {
                console.error("Delete Error:", err);
            }
        });

        socket.on('send_reaction', ({ emoji, streamId }) => {
            io.to(streamId).emit('receive_reaction', { emoji, id: Date.now() });
        });

        socket.on('disconnect', () => {
            console.log(`>>> Client Disconnected: ${socket.id}`);
        });
    });
};
