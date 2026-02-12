import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import Hls from 'hls.js';
import { 
    Send, Shield, Ban, Users, Smile, MoreVertical,
    Heart, Trash2, Activity, Radio, Maximize2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from '../components/theme-provider';
import { useAuth } from '../context/AuthContext';

/**
 * ─── ARCHITECTURE ───────────────────────────────────────
 * 
 *  STREAMER (OBS)
 *     ↓ RTMP
 *  RTMP Server (node-media-server, port 1935)
 *     ↓ FFmpeg
 *  HLS Output (.m3u8 + .ts chunks)
 *     ↓ HTTP
 *  Viewers (HLS.js player in browser)
 * 
 *  CHAT: Socket.IO (WebSockets)
 *     User → send_message → Server → broadcast → All viewers
 * 
 * ────────────────────────────────────────────────────────
 */

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'https://synapt-server.onrender.com';
const HLS_SERVER = import.meta.env.VITE_HLS_SERVER || 'http://localhost:8000';

export const LiveStream = () => {
    // ─── State ──────────────────────────────────
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isBlocked, setIsBlocked] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);  // Viewer receives this
    const [hlsUrl, setHlsUrl] = useState('');
    const [reactions, setReactions] = useState([]);
    const [chartData, setChartData] = useState(
        Array.from({ length: 20 }, () => ({ val: 40 + Math.random() * 20 }))
    );

    const { user: authUser, isAuthenticated } = useAuth();
    const { theme } = useTheme();

    const currentUser = authUser || {
        _id: 'guest_' + Math.random().toString(36).substr(2, 9),
        username: 'Guest',
        role: 'viewer'
    };

    const isStreamer = currentUser.role === 'streamer';

    // ─── Refs ───────────────────────────────────
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const videoRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const hlsRef = useRef(null);
    const pickerRef = useRef(null);
    const peerConnections = useRef({});    // Streamer: map of viewerId -> RTCPeerConnection
    const viewerPeerRef = useRef(null);    // Viewer: single peer connection to streamer
    const localStreamRef = useRef(null);   // Keep stream ref for peer creation
    const iceCandidateQueue = useRef([]);  // Queue ICE candidates until remote desc is set

    // Stream ID
    const streamId = 'synapt_main_stream';

    // WebRTC config
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
        ]
    };

    // ─── Socket.IO Connection ───────────────────
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[SOCKET] Connected:', socket.id);
            setIsConnected(true);
            socket.emit('join_stream', streamId);

            // Check block status if authenticated
            if (authUser?._id) {
                socket.emit('check_block_status', { userId: authUser._id });
            }
        });

        socket.on('disconnect', () => {
            console.log('[SOCKET] Disconnected');
            setIsConnected(false);
        });

        // ─── Stream lifecycle events ────────
        socket.on('stream_active', ({ hlsUrl: url, streamerId, mode }) => {
            console.log('[STREAM] Active:', mode, url);
            setIsLive(true);
            if (url) setHlsUrl(url);
            // If browser-based stream and we're a viewer, request WebRTC connection
            if (mode === 'browser' && !isStreamer) {
                socket.emit('request_stream', { streamId, viewerId: socket.id });
            }
        });

        socket.on('stream_started', ({ hlsUrl: url, streamerId, mode }) => {
            console.log('[STREAM] Started:', mode, url);
            setIsLive(true);
            if (url) setHlsUrl(url);
            toast.success('🔴 Broadcast is LIVE');
            // If browser-based and we're a viewer, request WebRTC connection
            if (mode === 'browser' && !isStreamer) {
                socket.emit('request_stream', { streamId, viewerId: socket.id });
            }
        });

        socket.on('stream_ended', () => {
            console.log('[STREAM] Ended');
            setIsLive(false);
            setHlsUrl('');
            setRemoteStream(null);
            // Close viewer peer connection
            if (viewerPeerRef.current) {
                viewerPeerRef.current.close();
                viewerPeerRef.current = null;
            }
            toast.info('Broadcast has ended');
        });

        // ─── WebRTC Signaling (Streamer side) ────
        // Server tells streamer: a new viewer wants the stream
        socket.on('viewer_joined', async ({ viewerId }) => {
            console.log('[WEBRTC] Viewer joined, creating offer for:', viewerId);
            const stream = localStreamRef.current;
            if (!stream) return;

            const pc = new RTCPeerConnection(rtcConfig);
            peerConnections.current[viewerId] = pc;

            // Add all camera tracks to this connection
            stream.getTracks().forEach(track => pc.addTrack(track, stream));

            // Send ICE candidates to the viewer
            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit('ice_candidate', { candidate: e.candidate, targetId: viewerId });
                }
            };

            // Create and send offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit('stream_offer', { offer, viewerId });
        });

        // Streamer receives answer from viewer
        socket.on('stream_answer', async ({ answer, viewerId }) => {
            console.log('[WEBRTC] Got answer from viewer:', viewerId);
            const pc = peerConnections.current[viewerId];
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        // ─── WebRTC Signaling (Viewer side) ────
        // Viewer receives offer from streamer
        socket.on('stream_offer', async ({ offer, streamerId }) => {
            console.log('[WEBRTC] Got offer from streamer:', streamerId);
            
            const pc = new RTCPeerConnection(rtcConfig);
            viewerPeerRef.current = pc;
            iceCandidateQueue.current = [];

            // When we receive the remote stream, display it
            pc.ontrack = (event) => {
                console.log('[WEBRTC] Received remote track:', event.track.kind);
                const remStream = event.streams[0];
                setRemoteStream(remStream);
            };

            // Send our ICE candidates to the streamer
            pc.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit('ice_candidate', { candidate: e.candidate, targetId: streamerId });
                }
            };

            // Set remote description, then create and send answer
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
            
            // Process any queued ICE candidates
            for (const candidate of iceCandidateQueue.current) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
            iceCandidateQueue.current = [];

            const answer2 = await pc.createAnswer();
            await pc.setLocalDescription(answer2);
            socket.emit('stream_answer', { answer: answer2, streamerId });
        });

        // ─── ICE candidate exchange ────
        socket.on('ice_candidate', async ({ candidate, senderId }) => {
            // Could be for streamer or viewer
            const streamerPc = peerConnections.current[senderId];
            const viewerPc = viewerPeerRef.current;

            if (streamerPc) {
                // Streamer receiving ICE from a viewer
                try {
                    await streamerPc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) { console.warn('ICE error (streamer):', e); }
            } else if (viewerPc) {
                // Viewer receiving ICE from the streamer
                if (viewerPc.remoteDescription) {
                    try {
                        await viewerPc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) { console.warn('ICE error (viewer):', e); }
                } else {
                    // Queue until remote description is set
                    iceCandidateQueue.current.push(candidate);
                }
            }
        });

        // ─── Chat events ────────────────────
        socket.on('receive_message', (msg) => {
            setMessages(prev => {
                if (prev.find(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        });

        socket.on('message_deleted', (messageId) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        });

        socket.on('blocked', ({ reason, duration }) => {
            setIsBlocked(true);
            toast.error(`Blocked: ${reason}`);
            if (duration) {
                setTimeout(() => setIsBlocked(false), duration * 1000);
            }
        });

        socket.on('user_blocked', ({ username, reason }) => {
            toast.warning(`${username} was muted: ${reason}`);
        });

        // ─── Viewer count ───────────────────
        socket.on('viewer_count', (count) => {
            setViewerCount(count);
        });

        // ─── Reactions ──────────────────────
        socket.on('receive_reaction', (data) => {
            const id = Math.random().toString(36).substr(2, 9);
            setReactions(prev => [...prev, { ...data, id }]);
            setTimeout(() => {
                setReactions(prev => prev.filter(r => r.id !== id));
            }, 3000);
        });

        // ─── Load chat history ──────────────
        fetch(`${SOCKET_URL}/api/streams/${streamId}/messages`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMessages(data);
            })
            .catch(() => {});

        return () => {
            socket.disconnect();
        };
    }, []);

    // ─── HLS.js Video Player ────────────────────
    useEffect(() => {
        if (!hlsUrl || !videoRef.current) return;

        const fullUrl = hlsUrl.startsWith('http') ? hlsUrl : `${HLS_SERVER}${hlsUrl}`;
        console.log('[HLS] Loading stream:', fullUrl);

        if (Hls.isSupported()) {
            // Destroy previous instance
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }

            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                liveSyncDuration: 3,
                liveMaxLatencyDuration: 10,
                liveDurationInfinity: true,
                maxBufferLength: 10,
                maxMaxBufferLength: 30,
            });

            hls.loadSource(fullUrl);
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log('[HLS] Manifest parsed, starting playback');
                videoRef.current.play().catch(err => {
                    console.warn('[HLS] Autoplay blocked:', err);
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error('[HLS] Error:', data.type, data.details);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('[HLS] Network error, retrying...');
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('[HLS] Media error, recovering...');
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });

            hlsRef.current = hls;
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            videoRef.current.src = fullUrl;
            videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current.play();
            });
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [hlsUrl]);

    // ─── Chart simulation ───────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => [...prev.slice(1), { val: 30 + Math.random() * 50 }]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // ─── Auto-scroll chat ───────────────────────
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ─── Close emoji picker on outside click ────
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ─── Browser Camera Streaming (GO LIVE) ────
    const startStreaming = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
            localStreamRef.current = stream;  // Keep ref for WebRTC peer creation
            setIsStreaming(true);
            setIsLive(true);

            // Notify everyone in room — include mode:'browser' for WebRTC
            socketRef.current.emit('start_stream', {
                streamId,
                userId: currentUser._id,
                hlsUrl: '',
                mode: 'browser'
            });

            socketRef.current.emit('send_message', {
                userId: currentUser._id,
                username: 'SYSTEM',
                content: '🔴 LIVE BROADCAST STARTED',
                streamId,
                role: 'moderator'
            });

            toast.success('Broadcast System Online');
        } catch (err) {
            console.error('Failed to start stream:', err);
            toast.error('Camera access denied');
        }
    };

    const stopStreaming = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
            localStreamRef.current = null;
        }
        // Close all peer connections
        Object.values(peerConnections.current).forEach(pc => pc.close());
        peerConnections.current = {};
        if (viewerPeerRef.current) {
            viewerPeerRef.current.close();
            viewerPeerRef.current = null;
        }
        setIsStreaming(false);
        setIsLive(false);
        setRemoteStream(null);

        socketRef.current.emit('stop_stream', { streamId });
        socketRef.current.emit('send_message', {
            userId: currentUser._id,
            username: 'SYSTEM',
            content: '⏹️ BROADCAST ENDED',
            streamId,
            role: 'moderator'
        });

        toast.info('Broadcast Terminated');
    };

    // Attach local camera to video element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    // Attach remote stream (viewer receives streamer's camera)
    // Use ref callback approach for maximum reliability
    const attachRemoteStream = (el) => {
        remoteVideoRef.current = el;
        if (el && remoteStream) {
            el.srcObject = remoteStream;
            el.muted = true; // Required for autoplay policy
            el.play().then(() => {
                console.log('[WEBRTC] Remote video playing!');
                // Unmute after playback starts
                setTimeout(() => { el.muted = false; }, 500);
            }).catch(err => {
                console.warn('[WEBRTC] Play failed, trying muted:', err);
                el.muted = true;
                el.play().catch(() => {});
            });
        }
    };

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.muted = true;
            remoteVideoRef.current.play().then(() => {
                setTimeout(() => { 
                    if (remoteVideoRef.current) remoteVideoRef.current.muted = false; 
                }, 500);
            }).catch(() => {});
        }
    }, [remoteStream]);

    // ─── Actions ────────────────────────────────
    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || isBlocked || !isConnected || !isAuthenticated) return;

        socketRef.current.emit('send_message', {
            userId: currentUser._id,
            username: currentUser.username,
            content: input,
            streamId,
            role: currentUser.role
        });
        setInput("");
    };

    const deleteMessage = (messageId) => {
        if (currentUser.role !== 'moderator') return;
        socketRef.current.emit('delete_message', { messageId, streamId });
    };

    const sendReaction = (emoji) => {
        if (!isConnected) return;
        socketRef.current.emit('send_reaction', { emoji, streamId });
    };

    const onEmojiClick = (emojiData) => {
        setInput(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // ─── Render ─────────────────────────────────
    return (
        <div className="min-h-screen bg-background noise-bg selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-primary/[0.06] blur-[150px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-15%] w-[45%] h-[45%] bg-blue-500/[0.04] blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '-4s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-red-500/[0.02] blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-2s' }}></div>
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.015]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="max-w-[1920px] mx-auto pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-12 px-3 sm:px-4 md:px-8 lg:px-12 relative z-10">

                {/* ═══ HEADER ═══ */}
                <motion.div 
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-6 sm:mb-8 md:mb-10"
                >
                    {/* Top row: Title + Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-5 md:gap-6">
                        <div className="space-y-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2.5">
                                <div className="relative flex items-center justify-center">
                                    <span className={`flex h-2 w-2 rounded-full ${isLive ? 'bg-red-500' : 'bg-foreground/20'}`} />
                                    {isLive && <span className="absolute h-2 w-2 rounded-full bg-red-500/50 animate-ping" />}
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-black tracking-[0.4em] sm:tracking-[0.5em] uppercase text-muted-foreground/70">
                                    {isLive ? 'Broadcasting Live' : 'Synapt Guardian Active'}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.9]">
                                Spam <span className="text-primary italic">Detection Shield</span>
                            </h1>
                        </div>

                        {/* Action buttons + stats */}
                        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full md:w-auto">
                            {isStreamer && (
                                !isStreaming ? (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={startStreaming}
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-5 h-auto font-black uppercase tracking-widest text-[9px] sm:text-[10px] flex items-center gap-2 shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            GO LIVE
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button 
                                            onClick={stopStreaming}
                                            variant="outline"
                                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-5 h-auto font-black uppercase tracking-widest text-[9px] sm:text-[10px]"
                                        >
                                            STOP STREAM
                                        </Button>
                                    </motion.div>
                                )
                            )}
                            <div className="glass px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/10 flex-1 md:flex-none text-center md:text-left min-w-[100px] sm:min-w-[130px]">
                                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground mb-0.5">Viewers</div>
                                <div className="flex items-center justify-center md:justify-start gap-1.5">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                    <span className="text-base sm:text-lg font-bold font-mono tracking-tighter">{viewerCount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="glass px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-border/10 flex-1 md:flex-none text-center md:text-left min-w-[100px] sm:min-w-[130px]">
                                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground mb-0.5">Status</div>
                                <div className={`flex justify-center md:justify-start items-center gap-1.5 font-bold text-[9px] sm:text-[10px] uppercase tracking-tighter ${isLive ? 'text-red-500' : 'text-primary'}`}>
                                    {isLive ? '🔴 STREAM LIVE' : 'SECURE LINK'}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ═══ MAIN GRID: Video + Chat ═══ */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    
                    {/* ── LEFT: Analytics (hidden on mobile, shown on lg+) ── */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="hidden lg:block lg:order-1 lg:col-span-3 space-y-5"
                    >
                        {/* Detection Pulse */}
                        <div className="glass p-5 xl:p-6 rounded-2xl xl:rounded-3xl border border-border/10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-[8px] xl:text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">Detection Pulse</div>
                                <Shield className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-primary animate-pulse" />
                            </div>
                            <div className="h-16 xl:h-20 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <Line type="monotone" dataKey="val" stroke="currentColor" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="pt-3 border-t border-border/5 grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[7px] xl:text-[8px] uppercase font-black text-muted-foreground tracking-widest">Filter Load</div>
                                    <div className="text-base xl:text-lg font-bold font-mono tracking-tighter">92.4%</div>
                                </div>
                                <div>
                                    <div className="text-[7px] xl:text-[8px] uppercase font-black text-muted-foreground tracking-widest">Latency</div>
                                    <div className="text-base xl:text-lg font-bold font-mono tracking-tighter">8ms</div>
                                </div>
                            </div>
                        </div>

                        {/* Controller Info */}
                        <div className="glass p-5 xl:p-6 rounded-2xl xl:rounded-3xl border border-border/10 space-y-4">
                            <div className="text-[8px] xl:text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">Controller</div>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg font-black border border-primary/20">S</div>
                                <div>
                                    <h3 className="font-bold text-xs xl:text-sm tracking-tight leading-none mb-1">Synapt Core AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"></div>
                                        <p className="text-[7px] xl:text-[8px] uppercase font-bold text-green-500/80 tracking-widest">Active</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[10px] xl:text-[11px] font-light leading-relaxed text-muted-foreground/50">
                                Real-time content analysis and automated suppression powered by Synapt Intelligence.
                            </p>
                        </div>

                        {/* Architecture */}
                        <div className="glass p-5 xl:p-6 rounded-2xl xl:rounded-3xl border border-border/10 space-y-3">
                            <div className="text-[8px] xl:text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">Pipeline</div>
                            <div className="space-y-2 text-[9px] xl:text-[10px] font-mono text-foreground/35">
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-500' : 'bg-foreground/20'}`} />
                                    <span>OBS → RTMP</span>
                                </div>
                                <div className="ml-3 border-l border-foreground/10 pl-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-yellow-500' : 'bg-foreground/20'}`} />
                                        <span>FFmpeg → HLS</span>
                                    </div>
                                </div>
                                <div className="ml-6 border-l border-foreground/10 pl-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500' : 'bg-foreground/20'}`} />
                                        <span>HLS.js → Viewer</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className="glass p-5 xl:p-6 rounded-2xl xl:rounded-3xl border border-border/10 space-y-3">
                            <div className="text-[8px] xl:text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">Systems</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'Socket.IO', ok: isConnected },
                                    { name: 'Spam Filter', ok: true },
                                    { name: 'WebRTC', ok: isLive },
                                ].map(({ name, ok }) => (
                                    <div key={name} className="flex items-center justify-between">
                                        <span className="text-[9px] xl:text-[10px] text-foreground/40">{name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]' : 'bg-foreground/20'}`} />
                                            <span className={`text-[8px] font-bold uppercase ${ok ? 'text-green-500/70' : 'text-foreground/20'}`}>{ok ? 'ON' : 'OFF'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── CENTER: VIDEO + INPUT ── */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="order-1 lg:order-2 lg:col-span-6 space-y-3 sm:space-y-4 md:space-y-5"
                    >
                        {/* Video Player */}
                        <div className="relative aspect-video rounded-2xl sm:rounded-3xl md:rounded-[40px] lg:rounded-[48px] overflow-hidden bg-black shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:shadow-[0_30px_80px_rgba(0,0,0,0.5)] border border-white/[0.06] group">
                            {/* Video Display */}
                            {isStreaming ? (
                                <video 
                                    ref={localVideoRef}
                                    autoPlay muted playsInline 
                                    className="w-full h-full object-cover"
                                />
                            ) : remoteStream ? (
                                <video 
                                    ref={attachRemoteStream}
                                    autoPlay muted playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : isLive && hlsUrl ? (
                                <video 
                                    ref={videoRef}
                                    autoPlay playsInline controls
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <iframe 
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1&playlist=jfKfPfyJRdk&modestbranding=1" 
                                    title="Synapt Video" frameBorder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope" 
                                    allowFullScreen
                                ></iframe>
                            )}

                            {/* Floating Reactions */}
                            <div className="absolute inset-x-0 bottom-0 top-1/3 pointer-events-none flex justify-center items-end overflow-hidden pb-8">
                                <AnimatePresence>
                                    {reactions.map((r) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, y: 60, scale: 0.5, x: (Math.random() - 0.5) * 150 }}
                                            animate={{ opacity: 1, y: -300, scale: 1.8 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 3.5, ease: "easeOut" }}
                                            className="text-2xl sm:text-3xl md:text-4xl absolute filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                                        >
                                            {r.emoji}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Hover controls */}
                            <div className="absolute top-3 sm:top-5 md:top-6 right-3 sm:right-5 md:right-6 flex gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="glass w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                <button className="glass w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>

                            {/* LIVE badge */}
                            {isLive && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute top-3 sm:top-5 md:top-6 left-3 sm:left-5 md:left-6 flex items-center gap-1.5 sm:gap-2 bg-red-600/90 backdrop-blur-sm text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-[0_2px_10px_rgba(239,68,68,0.4)]"
                                >
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                </motion.div>
                            )}

                            {/* Bottom gradient overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Reaction Bar */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 py-2 sm:py-3 glass rounded-xl sm:rounded-2xl md:rounded-3xl border border-white/5 px-2 sm:px-4">
                            {[
                                { e: '🛡️', l: 'Guard' }, 
                                { e: '⚡', l: 'Fast' }, 
                                { e: '🚫', l: 'Stop' }, 
                                { e: '👁️', l: 'Watch' }, 
                                { e: '✅', l: 'OK' }
                            ].map(rect => (
                                <motion.button 
                                    whileHover={{ scale: 1.15, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    key={rect.e}
                                    onClick={() => sendReaction(rect.e)}
                                    className="p-1.5 sm:p-2 md:p-3 hover:bg-white/5 rounded-lg sm:rounded-xl md:rounded-2xl transition-all cursor-pointer relative group/r flex-1 flex flex-col items-center"
                                >
                                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{rect.e}</span>
                                    <span className="hidden md:block absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase tracking-widest opacity-0 group-hover/r:opacity-30 transition-opacity whitespace-nowrap">
                                        {rect.l}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Mobile-only: Mini Stats Row */}
                        <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                            {[
                                { icon: Shield, label: 'Filter', value: '92.4%', color: 'text-primary' },
                                { icon: Activity, label: 'Latency', value: '8ms', color: 'text-green-400' },
                                { icon: Radio, label: 'Protocol', value: isConnected ? 'Connected' : 'Offline', color: isConnected ? 'text-green-400' : 'text-red-400' },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="glass px-3 py-2 rounded-xl border border-border/10 flex items-center gap-2 min-w-fit">
                                    <Icon className={`w-3 h-3 ${color}`} />
                                    <span className="text-[8px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
                                    <span className="text-[10px] font-bold font-mono">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="glass p-2.5 sm:p-3 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl md:rounded-3xl border border-border/10 relative z-50">
                            {!isAuthenticated ? (
                                <div className="p-3 sm:p-4 bg-foreground/5 border border-foreground/10 rounded-xl sm:rounded-2xl flex items-center gap-3 text-foreground/40">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Login to chat</span>
                                </div>
                            ) : isBlocked ? (
                                <div className="p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl flex items-center gap-3 text-red-500">
                                    <Ban className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">Temporarily muted</span>
                                </div>
                            ) : (
                                <form onSubmit={sendMessage} className="relative">
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder={isConnected ? "Transmit message..." : "Syncing..."}
                                            disabled={!isConnected}
                                            className="w-full bg-foreground/[0.02] border border-border/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 text-xs sm:text-sm md:text-base focus:outline-none focus:ring-1 ring-primary/20 transition-all font-light pr-24 sm:pr-32 md:pr-36"
                                        />
                                        <div className="absolute right-12 sm:right-16 md:right-20 top-1/2 -translate-y-1/2 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-1.5 sm:p-2 hover:bg-foreground/5 rounded-lg sm:rounded-xl transition-all text-muted-foreground hover:text-primary"
                                            >
                                                <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={!input.trim() || !isConnected}
                                            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-20"
                                        >
                                            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                                        </button>

                                        {showEmojiPicker && (
                                            <div ref={pickerRef} className="absolute bottom-full right-0 mb-3 z-[60] scale-[0.85] sm:scale-100 origin-bottom-right">
                                                <EmojiPicker 
                                                    theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                                                    onEmojiClick={onEmojiClick}
                                                    autoFocusSearch={false}
                                                    width={Math.min(window.innerWidth - 32, 350)}
                                                    height={350}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* ── RIGHT: LIVE CHAT ── */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="order-2 lg:order-3 lg:col-span-3 h-full"
                    >
                        <div className="glass h-[400px] sm:h-[500px] md:h-[550px] lg:h-[calc(100vh-200px)] flex flex-col rounded-2xl sm:rounded-3xl md:rounded-[40px] lg:rounded-[48px] border border-border/5 bg-background/50 backdrop-blur-3xl overflow-hidden shadow-xl sm:shadow-2xl lg:sticky lg:top-28">
                            {/* Chat Header */}
                            <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-50"></div>
                                    </div>
                                    <h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-muted-foreground">Chat</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-mono text-foreground/20">{messages.length} msgs</span>
                                    <MoreVertical className="w-3.5 h-3.5 opacity-20" />
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-2.5 sm:space-y-3 md:space-y-4 custom-scrollbar">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div 
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="group relative"
                                        >
                                            <div className="flex flex-col gap-1.5 p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-foreground/[0.02] border border-border/5 hover:bg-foreground/[0.04] transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${
                                                            msg.role === 'moderator' ? 'text-blue-500' : 
                                                            msg.role === 'streamer' ? 'text-red-400' :
                                                            'text-muted-foreground'
                                                        }`}>
                                                            {msg.username}
                                                        </span>
                                                        {msg.role === 'moderator' && <Shield className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-blue-500" />}
                                                        {msg.role === 'streamer' && <Radio className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-400" />}
                                                    </div>
                                                    {currentUser.role === 'moderator' && (
                                                        <Trash2 
                                                            className="w-3 h-3 text-destructive/30 hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-all" 
                                                            onClick={() => deleteMessage(msg._id)}
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-[11px] sm:text-xs md:text-sm font-light leading-relaxed break-words opacity-75 whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Footer */}
                            <div className="px-4 sm:px-5 py-2.5 sm:py-3 border-t border-white/5 flex justify-between items-center bg-foreground/[0.02]">
                                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] opacity-15 italic">Protocol Secured</span>
                                <div className="flex items-center gap-2">
                                    <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-10" />
                                    <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-10" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
