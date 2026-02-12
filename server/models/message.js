const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: String,
    content: { type: String, required: true },
    streamId: { type: String, required: true },
    role: { type: String, default: 'viewer' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
