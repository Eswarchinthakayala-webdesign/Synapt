const express = require('express');
const router = express.Router();
const Stream = require('../models/stream');
const Message = require('../models/message');
const { auth, authorize } = require('../middlewares/auth');

// ───────────────────────────────────────────────────
// GET /api/streams/messages/:streamId
// Get chat history for a stream (Public)
// ───────────────────────────────────────────────────
router.get('/:streamId/messages', async (req, res) => {
    try {
        const messages = await Message.find({ streamId: req.params.streamId })
            .sort({ timestamp: -1 })
            .limit(50);
        res.json(messages.reverse());
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ───────────────────────────────────────────────────
// GET /api/streams/live
// Get all currently live streams (Public)
// ───────────────────────────────────────────────────
router.get('/live', async (req, res) => {
    try {
        const streams = await Stream.find({ isLive: true })
            .populate('streamerId', 'username avatar')
            .sort({ startedAt: -1 });
        res.json(streams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ───────────────────────────────────────────────────
// GET /api/streams/my-stream
// Get streamer's own stream config (Protected: streamer only)
// ───────────────────────────────────────────────────
router.get('/my-stream', auth, authorize('streamer'), async (req, res) => {
    try {
        let stream = await Stream.findOne({ streamerId: req.user.id });
        
        if (!stream) {
            // Create a stream config for this streamer
            stream = await Stream.create({
                streamerId: req.user.id,
                title: `${req.user.username}'s Stream`
            });
        }

        res.json(stream);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ───────────────────────────────────────────────────
// PUT /api/streams/my-stream
// Update stream details (Protected: streamer only)
// ───────────────────────────────────────────────────
router.put('/my-stream', auth, authorize('streamer'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const stream = await Stream.findOneAndUpdate(
            { streamerId: req.user.id },
            { title, description },
            { new: true }
        );
        if (!stream) {
            return res.status(404).json({ message: 'Stream not found.' });
        }
        res.json(stream);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ───────────────────────────────────────────────────
// GET /api/streams/:streamId
// Get a specific stream by ID (Public)
// ───────────────────────────────────────────────────
router.get('/:streamId', async (req, res) => {
    try {
        const stream = await Stream.findById(req.params.streamId)
            .populate('streamerId', 'username avatar');
        if (!stream) {
            return res.status(404).json({ message: 'Stream not found.' });
        }
        res.json(stream);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
