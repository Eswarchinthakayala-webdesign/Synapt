const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// Get chat history for a stream
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

module.exports = router;
