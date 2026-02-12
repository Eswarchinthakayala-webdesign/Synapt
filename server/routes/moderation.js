const express = require('express');
const router = express.Router();
const ModerationLog = require('../models/moderationLog');
const User = require('../models/user');

// Get moderation stats
router.get('/stats', async (req, res) => {
    try {
        const totalBlocked = await User.countDocuments({ isBlocked: true });
        const totalLogs = await ModerationLog.countDocuments();
        res.json({
            totalBlocked,
            totalLogs,
            // You could add more stats here
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all logs
router.get('/logs', async (req, res) => {
    try {
        const logs = await ModerationLog.find().populate('userId').sort({ createdAt: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unblock user
router.post('/unblock/:userId', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { isBlocked: false });
        res.json({ message: 'User unblocked successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
