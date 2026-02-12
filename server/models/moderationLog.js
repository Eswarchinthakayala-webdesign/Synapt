const mongoose = require('mongoose');

const moderationLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    action: String,
    details: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModerationLog', moderationLogSchema);
