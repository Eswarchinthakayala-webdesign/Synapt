const stringSimilarity = require('string-similarity');

class SpamDetectionService {
    /**
     * Detects various spam patterns
     * @param {string} content New message content
     * @param {Array} history Last N messages from this user (excluding current)
     */
    detect(content, history) {
        if (!history || history.length === 0) return { spam: false };

        const now = Date.now();
        const tenSecondsAgo = now - 10000;
        const fiveSecondsAgo = now - 5000;

        // 1. Same message repeated ≥ 3 times in 10s
        // (If 2 existing messages are same, this new one makes it 3)
        const recentSame = history.filter(msg => 
            msg.content.trim().toLowerCase() === content.trim().toLowerCase() && 
            msg.timestamp > tenSecondsAgo
        );
        if (recentSame.length >= 3) {
            console.log(`[SPAM] Repetitive content detected for user. Count: ${recentSame.length + 1}`);
            return { spam: true, reason: "REPETITIVE_CONTENT" };
        }

        // 2. Message flood ≥ 8 messages in 5s
        // (If 7 existing messages within 5s, this new one makes it 8)
        const recentFlood = history.filter(msg => msg.timestamp > fiveSecondsAgo);
        if (recentFlood.length >= 10) {
            console.log(`[SPAM] Message flood detected. Rate: ${recentFlood.length + 1} msgs / 5s`);
            return { spam: true, reason: "MESSAGE_FLOOD" };
        }

        for (const msg of history) {
            if (msg.timestamp > tenSecondsAgo) {
                const similarity = stringSimilarity.compareTwoStrings(content.toLowerCase(), msg.content.toLowerCase());
                if (similarity >= 0.95) {
                    console.log(`[SPAM] High similarity detected: ${Math.round(similarity * 100)}%`);
                    return { spam: true, reason: "SIMILARITY_VIOLATION" };
                }
            }
        }

        return { spam: false };
    }
}

module.exports = new SpamDetectionService();
