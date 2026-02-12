const NodeMediaServer = require('node-media-server');
const Stream = require('../models/stream');
const path = require('path');
const fs = require('fs');

/**
 * RTMP → HLS Live Streaming Server
 * 
 * FLOW:
 *   OBS (Streamer) → RTMP Server → FFmpeg → HLS (.m3u8 + .ts) → Viewers (HLS.js)
 * 
 * The Node Media Server handles:
 *   1. Receiving RTMP streams from OBS
 *   2. Transcoding RTMP to HLS via FFmpeg
 *   3. Serving HLS segments over HTTP
 */

// HLS output directory
const HLS_OUTPUT_DIR = path.join(__dirname, '..', 'media');

const createMediaServer = () => {
    // Ensure media directory exists
    if (!fs.existsSync(HLS_OUTPUT_DIR)) {
        fs.mkdirSync(HLS_OUTPUT_DIR, { recursive: true });
    }

    const config = {
        rtmp: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        http: {
            port: 8000,
            mediaroot: HLS_OUTPUT_DIR,
            allow_origin: '*'
        },
        trans: {
            ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
            tasks: [
                {
                    app: 'live',
                    // FFmpeg converts RTMP → HLS (.m3u8 + .ts segments)
                    hls: true,
                    hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                    hlsKeep: false,
                    dash: false
                }
            ]
        }
    };

    const nms = new NodeMediaServer(config);

    // ─── RTMP Event Hooks ─────────────────────────────
    nms.on('prePublish', async (id, StreamPath, args) => {
        console.log(`[RTMP] Stream publishing request: ${StreamPath}`);
        
        // StreamPath format: /live/{streamKey}
        const streamKey = StreamPath.split('/')[2];
        
        if (!streamKey) {
            console.log('[RTMP] Rejected: No stream key');
            let session = nms.getSession(id);
            if (session) session.reject();
            return;
        }

        // Validate stream key against database
        try {
            const stream = await Stream.findOne({ streamKey });
            if (!stream) {
                console.log(`[RTMP] Rejected: Invalid stream key ${streamKey}`);
                let session = nms.getSession(id);
                if (session) session.reject();
                return;
            }

            // Mark stream as live
            stream.isLive = true;
            stream.startedAt = new Date();
            stream.hlsUrl = `/live/${streamKey}/index.m3u8`;
            await stream.save();

            console.log(`[RTMP] ✅ Stream LIVE: ${stream.title} (Key: ${streamKey})`);
        } catch (err) {
            console.error('[RTMP] Auth error:', err);
        }
    });

    nms.on('donePublish', async (id, StreamPath, args) => {
        console.log(`[RTMP] Stream ended: ${StreamPath}`);
        const streamKey = StreamPath.split('/')[2];

        try {
            const stream = await Stream.findOne({ streamKey });
            if (stream) {
                stream.isLive = false;
                stream.endedAt = new Date();
                stream.hlsUrl = '';
                await stream.save();
                console.log(`[RTMP] ⏹ Stream OFFLINE: ${stream.title}`);
            }
        } catch (err) {
            console.error('[RTMP] End stream error:', err);
        }
    });

    nms.on('prePlay', (id, StreamPath, args) => {
        console.log(`[RTMP] Viewer connected: ${StreamPath}`);
    });

    nms.on('donePlay', (id, StreamPath, args) => {
        console.log(`[RTMP] Viewer disconnected: ${StreamPath}`);
    });

    return nms;
};

module.exports = { createMediaServer, HLS_OUTPUT_DIR };
