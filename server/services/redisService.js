const redis = require('redis');

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.fallbackStore = new Map(); // For when Redis is unavailable

        this.init();
    }

    async init() {
        try {
            this.client = redis.createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });

            this.client.on('error', (err) => {
                if (this.isConnected || this.isConnected === null) {
                    console.warn('>>> Redis Offline: Using Neural Memory Fallback');
                }
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('>>> Redis Synced: Spam Tracking Active');
                this.isConnected = true;
            });

            await this.client.connect().catch(() => {
                // Silently handle initial connection failure as 'error' listener handles logging
            });
        } catch (err) {
            console.warn('>>> Could not connect to Redis, using in-memory fallback.');
            this.isConnected = false;
        }
    }

    async trackMessage(userId, content) {
        const timestamp = Date.now();
        const msgData = JSON.stringify({ content, timestamp });

        if (this.isConnected) {
            // Store message with 60s TTL
            const key = `chat_history:${userId}`;
            await this.client.lPush(key, msgData);
            await this.client.lTrim(key, 0, 19); // Keep last 20
            await this.client.expire(key, 60);
            
            const rawHistory = await this.client.lRange(key, 0, -1);
            return rawHistory.map(h => JSON.parse(h));
        } else {
            // Fallback logic
            if (!this.fallbackStore.has(userId)) {
                this.fallbackStore.set(userId, []);
            }
            const history = this.fallbackStore.get(userId);
            history.unshift({ content, timestamp });
            if (history.length > 20) history.pop();
            return history;
        }
    }

    async blockUser(userId) {
        if (this.isConnected) {
            await this.client.set(`blocked:${userId}`, 'true', { EX: 300 }); // Temporary Mute for 5 minutes (300s)
        } else {
            // Simple in-memory block (resets on restart)
            this.fallbackStore.set(`blocked:${userId}`, true);
            setTimeout(() => {
                this.fallbackStore.delete(`blocked:${userId}`);
            }, 300 * 1000);
        }
    }

    async isUserBlocked(userId) {
        if (this.isConnected) {
            const blocked = await this.client.get(`blocked:${userId}`);
            return !!blocked;
        } else {
            return !!this.fallbackStore.get(`blocked:${userId}`);
        }
    }
}

module.exports = new RedisService();
