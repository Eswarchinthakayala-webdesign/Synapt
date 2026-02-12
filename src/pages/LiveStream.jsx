import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { 
    Send, 
    User as UserIcon, 
    Shield, 
    AlertCircle, 
    Play, 
    MoreVertical, 
    MessageSquare, 
    Heart, 
    Trash2, 
    Ban,
    Zap,
    Users,
    Smile,
    ThumbsUp,
    Zap as Laugh,
    Flame,
    Hand,
    Star,
    Activity,
    Cpu,
    Radio,
    Maximize2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { useTheme } from '../components/theme-provider';

// Initialize socket outside or inside component with useMemo to avoid re-connections
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

export const LiveStream = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isBlocked, setIsBlocked] = useState(false);
    const [viewerCount, setViewerCount] = useState(12482);
    const [isConnected, setIsConnected] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { theme } = useTheme();
    const pickerRef = useRef(null);
    
    // Mock user for demo - Persist in localStorage to prevent block bypass on refresh
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('synapt_user');
        if (saved) {
            const user = JSON.parse(saved);
            // Auto-migrate from old name format if necessary
            if (user.username.startsWith("Voyager_")) {
                user.username = user.username.replace("Voyager_", "Synapt_");
                localStorage.setItem('synapt_user', JSON.stringify(user));
            }
            return user;
        }
        
        const newUser = { 
            _id: "user_" + Math.random().toString(36).substr(2, 9), 
            username: "Synapt_" + Math.floor(Math.random() * 1000), 
            role: "viewer" 
        };
        localStorage.setItem('synapt_user', JSON.stringify(newUser));
        return newUser;
    });
    
    const socketRef = useRef(null);
    const chatEndRef = useRef(null);
    const streamId = "synapt-main-stream";

    useEffect(() => {
        // Fetch message history
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${SOCKET_URL}/api/streams/${streamId}/messages`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error("Failed to fetch messages:", err);
            }
        };

        fetchMessages();

        // Create socket connection
        socketRef.current = io(SOCKET_URL);

        const socket = socketRef.current;

        socket.on('connect', async () => {
            setIsConnected(true);
            console.log('>>> Connected to Synapt Logic Core');
            socket.emit('join_stream', streamId);

            // Check if user is currently blocked on connect (handles refresh)
            socketRef.current.emit('check_block_status', { userId: currentUser._id });
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('receive_message', (msg) => {
            setMessages(prev => {
                // Prevent duplicate messages if any
                if (prev.find(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        });

        socket.on('user_blocked', (data) => {
            toast.error(`User ${data.username} blocked for ${data.reason}`, {
                icon: <Shield className="w-4 h-4" />
            });
        });

        socket.on('blocked', (data) => {
            setIsBlocked(true);
            toast.error(`Your account has been restricted: ${data.reason}`);
        });

        socket.on('message_deleted', (messageId) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        });

        socket.on('error', (err) => {
            toast.error(err);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim() || isBlocked || !isConnected) return;

        const messageData = {
            userId: currentUser._id,
            username: currentUser.username,
            content: input,
            streamId,
            role: currentUser.role
        };

        socketRef.current.emit('send_message', messageData);
        setInput("");
    };

    const deleteMessage = (messageId) => {
        if (currentUser.role !== 'moderator') return;
        socketRef.current.emit('delete_message', { messageId, streamId });
    };

    const onEmojiClick = (emojiData) => {
        setInput(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [reactions, setReactions] = useState([]);
    const [chartData, setChartData] = useState(Array.from({ length: 20 }, (_, i) => ({ val: 40 + Math.random() * 20 })));

    // Simulation for live chart
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => [...prev.slice(1), { val: 30 + Math.random() * 50 }]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const sendReaction = (emoji) => {
        if (!isConnected) return;
        socketRef.current.emit('send_reaction', { emoji, streamId });
    };

    useEffect(() => {
        if (!socketRef.current) return;
        
        socketRef.current.on('receive_reaction', (data) => {
            const id = Math.random().toString(36).substr(2, 9);
            setReactions(prev => [...prev, { ...data, id }]);
            setTimeout(() => {
                setReactions(prev => prev.filter(r => r.id !== id));
            }, 3000);
        });
    }, [isConnected]);

    return (
        <div className="min-h-screen bg-background noise-bg selection:bg-primary selection:text-primary-foreground">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '-4s' }}></div>
            </div>

            <div className="max-w-[1900px] mx-auto pt-20 md:pt-32 pb-12 px-4 md:px-12 relative z-10">
                {/* Header Info */}
                <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.5em] uppercase text-muted-foreground italic">Synapt Guardian Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-none">
                            Spam <span className="text-primary italic">Detection Shield</span>
                        </h1>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 w-full md:w-auto">
                        <div className="glass px-5 py-3 md:px-6 md:py-3 rounded-2xl md:rounded-[24px] border border-border/10 flex-1 md:flex-none text-center md:text-left min-w-[140px]">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Live Viewers</div>
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="text-lg md:text-xl font-bold font-mono tracking-tighter">{viewerCount.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="glass px-5 py-3 md:px-6 md:py-3 rounded-2xl md:rounded-[24px] border border-border/10 flex-1 md:flex-none text-center md:text-left min-w-[140px]">
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Status</div>
                            <div className="flex justify-center md:justify-start items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-tighter animate-pulse">
                                SECURE LINK ACTIVE
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:auto-rows-min">
                    
                    {/* LEFT PANEL: Context & Key Insights (Hidden on small mobile, shown after video on tablet) */}
                    <div className="order-3 lg:order-1 lg:col-span-3 space-y-6 md:space-y-8">
                        {/* Analytics Panel */}
                        <div className="glass p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-border/10 space-y-6 overflow-hidden relative group">
                            <div className="flex items-center justify-between">
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Detection Pulse</div>
                                <Shield className="w-3.5 h-3.5 text-primary animate-pulse" />
                            </div>
                            <div className="h-20 md:h-24 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <Line type="monotone" dataKey="val" stroke="currentColor" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="pt-4 border-t border-border/5 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Filter Load</div>
                                    <div className="text-lg font-bold font-mono tracking-tighter">92.4%</div>
                                </div>
                                <div>
                                    <div className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Reaction</div>
                                    <div className="text-lg font-bold font-mono tracking-tighter">8ms</div>
                                </div>
                            </div>
                        </div>

                        {/* Description / Host info */}
                        <div className="glass p-6 md:p-8 rounded-[32px] md:rounded-[48px] border border-border/10 space-y-5">
                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">Controller Info</div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-black border border-primary/20">S</div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight leading-none mb-1">Synapt Core AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                                        <p className="text-[8px] uppercase font-bold text-green-500/80 tracking-widest">Active Status</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[11px] md:text-xs font-light leading-relaxed text-muted-foreground/60">
                                Enforcing collective communication hygiene. Real-time content analysis and automated suppression powered by Synapt Intelligence.
                            </p>
                        </div>
                    </div>

                    {/* CENTER PANEL: THE STREAM */}
                    <div className="order-1 lg:order-2 lg:col-span-6 space-y-6 md:space-y-8">
                        <div className="relative aspect-video rounded-[32px] md:rounded-[60px] overflow-hidden bg-black shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5 group">
                            <iframe 
                                className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&controls=0&loop=1&playlist=jfKfPfyJRdk&modestbranding=1" 
                                title="Synapt Video" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; encrypted-media; gyroscope" 
                                allowFullScreen
                            ></iframe>

                            {/* Floating Reactions over Video */}
                            <div className="absolute inset-x-0 bottom-0 top-1/2 pointer-events-none flex justify-center items-end overflow-hidden pb-12">
                                <AnimatePresence>
                                    {reactions.map((r) => (
                                        <motion.div
                                            key={r.id}
                                            initial={{ opacity: 0, y: 100, scale: 0.5, x: (Math.random() - 0.5) * 200 }}
                                            animate={{ opacity: 1, y: -400, scale: 2 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 4, ease: "easeOut" }}
                                            className="text-4xl absolute filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        >
                                            {r.emoji}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Controls Overlay */}
                            <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="glass w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <Radio className="w-5 h-5" />
                                </button>
                                <button className="glass w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <Maximize2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Reaction Interaction Bar */}
                        <div className="flex items-center justify-center gap-2 md:gap-6 py-3 md:py-4 glass rounded-[24px] md:rounded-[32px] border border-white/5 px-4 md:px-0">
                            {[
                                { e: '🛡️', l: 'Guard' }, 
                                { e: '⚡', l: 'Fast' }, 
                                { e: '🚫', l: 'Stop' }, 
                                { e: '👁️', l: 'Watch' }, 
                                { e: '✅', l: 'OK' }
                            ].map(rect => (
                                <motion.button 
                                    whileHover={{ scale: 1.2, y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    key={rect.e}
                                    onClick={() => sendReaction(rect.e)}
                                    className="p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl transition-all cursor-pointer relative group flex-1 md:flex-none flex flex-col items-center"
                                >
                                    <span className="text-2xl md:text-3xl lg:text-4xl">{rect.e}</span>
                                    <span className="hidden md:block absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-40 transition-opacity whitespace-nowrap">
                                        {rect.l}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Commentary Input Bar */}
                        <div className="glass p-4 md:p-8 rounded-[32px] md:rounded-[48px] border border-border/10 relative z-50">
                            {isBlocked ? (
                                <div className="p-4 md:p-6 bg-red-500/10 border border-red-500/20 rounded-2xl md:rounded-3xl flex items-center gap-4 text-red-500">
                                    <Ban className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Communication Line Severed. (Rate limit violation).</span>
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
                                            className="w-full bg-foreground/[0.02] border border-border/10 rounded-2xl md:rounded-3xl px-4 md:px-10 py-4 md:py-6 text-sm md:text-lg focus:outline-none focus:ring-1 ring-primary/20 transition-all font-light pr-32 md:pr-40"
                                        />
                                        <div className="absolute right-16 md:right-24 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-2 md:p-3 hover:bg-foreground/5 rounded-xl md:rounded-2xl transition-all text-muted-foreground hover:text-primary"
                                            >
                                                <Smile className="w-5 h-5 md:w-6 md:h-6" />
                                            </button>
                                        </div>
                                        <button 
                                            type="submit"
                                            disabled={!input.trim() || !isConnected}
                                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-3xl bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-20 translate-z-0"
                                        >
                                            <Send className="w-4 h-4 md:w-6 md:h-6" />
                                        </button>

                                        {showEmojiPicker && (
                                            <div ref={pickerRef} className="absolute bottom-full right-0 mb-4 z-50 scale-75 md:scale-100 origin-bottom-right">
                                                <EmojiPicker 
                                                    theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                                                    onEmojiClick={onEmojiClick}
                                                    autoFocusSearch={false}
                                                    width={window.innerWidth < 768 ? window.innerWidth - 64 : 350}
                                                    height={400}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: LIVE FEED */}
                    <div className="order-2 lg:order-3 lg:col-span-3 h-full">
                        <div className="glass h-[500px] md:h-[600px] lg:h-[calc(100vh-220px)] flex flex-col rounded-[32px] md:rounded-[60px] border border-border/5 bg-background/50 backdrop-blur-3xl overflow-hidden shadow-2xl lg:sticky lg:top-32">
                            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]"></div>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Chat Monitor</h2>
                                </div>
                                <MoreVertical className="w-4 h-4 opacity-20" />
                            </div>

                            {/* Feed Area */}
                            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 md:space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-foreground/[0.01]">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg) => (
                                        <motion.div 
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group relative"
                                        >
                                            <div className="flex flex-col gap-2 p-4 md:p-5 rounded-2xl md:rounded-3xl bg-foreground/[0.02] border border-border/5 hover:bg-foreground/[0.05] transition-all group-hover:translate-x-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest ${msg.role === 'moderator' ? 'text-blue-500' : 'text-muted-foreground'}`}>
                                                            {msg.username}
                                                        </span>
                                                        {msg.role === 'moderator' && <Shield className="w-2.5 h-2.5 text-blue-500" />}
                                                    </div>
                                                    {currentUser.role === 'moderator' && (
                                                        <Trash2 
                                                            className="w-3.5 h-3.5 text-destructive/40 hover:text-destructive cursor-pointer opacity-0 group-hover:opacity-100 transition-all" 
                                                            onClick={() => deleteMessage(msg._id)}
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-xs md:text-sm font-light leading-relaxed break-words opacity-80 whitespace-pre-wrap">
                                                    {msg.content}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-5 md:p-6 border-t border-white/5 flex justify-between items-center bg-foreground/[0.02]">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-20 italic">Protocol Secured</span>
                                <div className="flex items-center gap-3">
                                    <Heart className="w-4 h-4 opacity-10" />
                                    <Activity className="w-4 h-4 opacity-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
