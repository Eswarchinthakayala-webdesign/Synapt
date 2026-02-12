import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Radio, Copy, Check, Eye, EyeOff, Tv, Users,
    Clock, Shield, Settings, Play, AlertCircle, ExternalLink,
    Zap, Activity, Signal, Wifi, Server, Globe, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { SnowBackground } from '../components/SnowBackground';

const API_URL = 'http://localhost:5000/api';

// Animated counter for stats
const AnimatedNumber = ({ value, suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const duration = 1500;
        const start = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);
    return <span>{display.toLocaleString()}{suffix}</span>;
};

// Pulse ring animation
const PulseRing = ({ active, size = 'md' }) => {
    const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' };
    return (
        <div className="relative flex items-center justify-center">
            <div className={`${sizes[size]} rounded-full ${active ? 'bg-red-500' : 'bg-foreground/20'}`} />
            {active && (
                <>
                    <div className={`absolute ${sizes[size]} rounded-full bg-red-500/40 animate-ping`} />
                    <div className={`absolute ${sizes[size]} rounded-full bg-red-500/20 animate-pulse scale-150`} />
                </>
            )}
        </div>
    );
};

const StreamerDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [stream, setStream] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [copied, setCopied] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('config');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMyStream();
    }, []);

    const fetchMyStream = async () => {
        try {
            const res = await fetch(`${API_URL}/streams/my-stream`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStream(data);
                setTitle(data.title || '');
                setDescription(data.description || '');
            }
        } catch (err) {
            toast.error('Failed to load stream config');
        } finally {
            setLoading(false);
        }
    };

    const updateStream = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/streams/my-stream`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });
            if (res.ok) {
                const data = await res.json();
                setStream(data);
                toast.success('Configuration synced');
            }
        } catch (err) {
            toast.error('Sync failed');
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        toast.success(`${label} copied`);
        setTimeout(() => setCopied(''), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <SnowBackground />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-2 border-red-500/30 border-t-red-500 rounded-full"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-bold tracking-[0.3em] uppercase text-foreground/30"
                >
                    Initializing Control Systems
                </motion.p>
            </div>
        );
    }

    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    });

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Three.js Snow Background */}
            <SnowBackground />

            {/* Gradient overlays */}
            <div className="fixed inset-0 pointer-events-none z-[1]">
                <div className="absolute top-0 left-0 w-[60%] h-[50%] bg-red-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[50%] h-[40%] bg-blue-500/[0.03] blur-[150px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-primary/[0.02] blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 pt-24 md:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* ═══ HERO HEADER ═══ */}
                    <motion.div {...fadeUp(0)} className="mb-10 md:mb-14">
                        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <PulseRing active={stream?.isLive} size="sm" />
                                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-foreground/30">
                                        {stream?.isLive ? 'LIVE BROADCAST' : 'BROADCAST CONTROL'}
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                                    Command <span className="text-primary italic">Center</span>
                                </h1>
                                <p className="text-foreground/40 text-sm max-w-md">
                                    Welcome back, <span className="text-foreground/70 font-semibold">{user?.username}</span>. 
                                    Configure your broadcast, manage OBS settings, and monitor your stream.
                                </p>
                            </div>

                            {/* Quick actions */}
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate('/live')}
                                    className="group flex items-center gap-3 px-6 py-4 glass rounded-2xl border border-foreground/10 hover:border-foreground/20 transition-all"
                                >
                                    <Radio className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-black tracking-wider uppercase">Go to Stream</span>
                                    <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ LIVE STATUS BANNER ═══ */}
                    <motion.div {...fadeUp(0.1)} className="mb-8">
                        <div className={`relative overflow-hidden p-6 md:p-8 rounded-[28px] border transition-all duration-500 ${
                            stream?.isLive
                                ? 'bg-red-500/[0.06] border-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.08)]'
                                : 'glass border-foreground/10'
                        }`}>
                            {/* Animated grid background */}
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                                    backgroundSize: '40px 40px'
                                }}
                            />

                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <PulseRing active={stream?.isLive} size="lg" />
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">
                                            {stream?.isLive ? 'Broadcasting Live' : 'Stream Offline'}
                                        </h2>
                                        <p className="text-xs text-foreground/40 mt-1">
                                            {stream?.isLive
                                                ? `Started ${new Date(stream.startedAt).toLocaleTimeString()}`
                                                : 'Configure OBS and click Start Streaming'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {stream?.isLive && (
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate('/live')}
                                            className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-2xl text-xs font-black tracking-wider uppercase hover:bg-red-600 transition-colors shadow-[0_4px_20px_rgba(239,68,68,0.3)]"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" /> View Stream
                                        </motion.button>
                                    )}
                                </div>
                            </div>

                            {/* Mini stats row */}
                            <div className="relative flex flex-wrap gap-6 mt-6 pt-6 border-t border-foreground/5">
                                {[
                                    { icon: Signal, label: 'Latency', value: stream?.isLive ? '~2s' : '—', color: 'text-green-400' },
                                    { icon: Wifi, label: 'Protocol', value: 'RTMP + HLS', color: 'text-blue-400' },
                                    { icon: Server, label: 'Server', value: 'Active', color: 'text-primary' },
                                    { icon: Globe, label: 'CDN', value: 'Edge Node', color: 'text-yellow-400' },
                                ].map(({ icon: Icon, label, value, color }, i) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-foreground/30">{label}</span>
                                        <span className="text-xs font-semibold text-foreground/60">{value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>



                    {/* ═══ MAIN CONTENT GRID ═══ */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* LEFT: Stream Config (8 cols) */}
                        <motion.div {...fadeUp(0.2)} className="lg:col-span-8 space-y-6">

                            {/* Tab Switcher */}
                            <div className="flex items-center gap-1 p-1.5 glass rounded-2xl border border-foreground/10 w-fit">
                                {[
                                    { id: 'config', label: 'Stream Settings', icon: Settings },
                                    { id: 'obs', label: 'OBS Setup', icon: Tv },
                                ].map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-300 ${
                                            activeTab === id
                                                ? 'bg-foreground text-background shadow-lg'
                                                : 'text-foreground/40 hover:text-foreground/70 hover:bg-foreground/5'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === 'config' ? (
                                    <motion.div
                                        key="config"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="space-y-6"
                                    >
                                        {/* Stream Details Card */}
                                        <div className="glass p-6 md:p-8 rounded-[28px] border border-foreground/10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                                    Broadcast Configuration
                                                </h2>
                                                <Zap className="w-4 h-4 text-primary/40" />
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-foreground/30 mb-3">
                                                        Stream Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        className="w-full px-5 py-4 bg-foreground/[0.04] border border-foreground/10 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-foreground/[0.06] transition-all placeholder:text-foreground/20"
                                                        placeholder="e.g., Building a React App Live"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-foreground/30 mb-3">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        rows={3}
                                                        className="w-full px-5 py-4 bg-foreground/[0.04] border border-foreground/10 rounded-2xl text-sm font-medium focus:outline-none focus:border-primary/30 focus:bg-foreground/[0.06] transition-all resize-none placeholder:text-foreground/20"
                                                        placeholder="Tell viewers what this stream is about..."
                                                    />
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={updateStream}
                                                    disabled={saving}
                                                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-foreground text-background rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase hover:opacity-90 transition-all disabled:opacity-50"
                                                >
                                                    {saving ? (
                                                        <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                                    ) : (
                                                        <Check className="w-4 h-4" />
                                                    )}
                                                    {saving ? 'Syncing' : 'Save Configuration'}
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* RTMP Config Card */}
                                        <div className="glass p-6 md:p-8 rounded-[28px] border border-foreground/10 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                                    Connection Credentials
                                                </h2>
                                                <Shield className="w-4 h-4 text-red-400/40" />
                                            </div>
                                            <div className="space-y-5">
                                                {/* RTMP URL */}
                                                <div>
                                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-foreground/30 mb-3">
                                                        RTMP Server URL
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 px-5 py-4 bg-foreground/[0.04] border border-foreground/10 rounded-2xl text-sm font-mono text-foreground/60 overflow-x-auto">
                                                            rtmp://localhost:1935/live
                                                        </div>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => copyToClipboard('rtmp://localhost:1935/live', 'URL')}
                                                            className="p-4 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-colors shrink-0"
                                                        >
                                                            {copied === 'URL' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-foreground/30" />}
                                                        </motion.button>
                                                    </div>
                                                </div>

                                                {/* Stream Key */}
                                                <div>
                                                    <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-foreground/30 mb-3">
                                                        Stream Key
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 px-5 py-4 bg-foreground/[0.04] border border-foreground/10 rounded-2xl text-sm font-mono text-foreground/60 overflow-x-auto">
                                                            {showKey ? (stream?.streamKey || '...') : '••••••••-••••-••••-••••-••••••••••••'}
                                                        </div>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setShowKey(!showKey)}
                                                            className="p-4 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-colors shrink-0"
                                                        >
                                                            {showKey ? <EyeOff className="w-4 h-4 text-foreground/30" /> : <Eye className="w-4 h-4 text-foreground/30" />}
                                                        </motion.button>
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => copyToClipboard(stream?.streamKey || '', 'Key')}
                                                            className="p-4 rounded-2xl border border-foreground/10 hover:bg-foreground/5 transition-colors shrink-0"
                                                        >
                                                            {copied === 'Key' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-foreground/30" />}
                                                        </motion.button>
                                                    </div>
                                                    <p className="text-[10px] text-red-400/60 mt-3 flex items-center gap-1.5 font-semibold">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Never share your stream key with anyone
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="obs"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                    >
                                        {/* OBS Setup Guide */}
                                        <div className="glass p-6 md:p-8 rounded-[28px] border border-foreground/10">
                                            <div className="flex items-center justify-between mb-8">
                                                <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                                    OBS Studio Integration
                                                </h2>
                                                <Play className="w-4 h-4 text-primary/40" />
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { step: 1, title: 'Download OBS Studio', desc: 'Get the latest version from obsproject.com', accent: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                                                    { step: 2, title: 'Open Stream Settings', desc: 'Navigate to Settings → Stream tab', accent: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                                                    { step: 3, title: 'Select Custom Service', desc: 'Choose "Custom..." from the Service dropdown', accent: 'bg-green-500/10 text-green-400 border-green-500/20' },
                                                    { step: 4, title: 'Paste RTMP URL', desc: 'Copy the server URL from above and paste it', accent: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
                                                    { step: 5, title: 'Paste Stream Key', desc: 'Copy your unique stream key and paste it', accent: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
                                                    { step: 6, title: 'Start Streaming!', desc: 'Click "Start Streaming" and you\'re live', accent: 'bg-red-500/10 text-red-400 border-red-500/20' },
                                                ].map(({ step, title: t, desc, accent }, i) => (
                                                    <motion.div
                                                        key={step}
                                                        initial={{ opacity: 0, x: -15 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-foreground/[0.02] transition-colors group"
                                                    >
                                                        <div className={`w-10 h-10 rounded-xl ${accent} border flex items-center justify-center text-sm font-black shrink-0`}>
                                                            {step}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm tracking-tight">{t}</p>
                                                            <p className="text-xs text-foreground/40 mt-0.5">{desc}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* RIGHT: Sidebar (4 cols) */}
                        <motion.div {...fadeUp(0.3)} className="lg:col-span-4 space-y-6">

                            {/* System Status */}
                            <div className="glass p-6 rounded-[28px] border border-foreground/10 space-y-5">
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                    System Status
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Express API', status: true, color: 'bg-green-500' },
                                        { label: 'Socket.IO', status: true, color: 'bg-green-500' },
                                        { label: 'MongoDB Atlas', status: true, color: 'bg-green-500' },
                                        { label: 'RTMP Server', status: true, color: 'bg-green-500' },
                                        { label: 'Spam Filter', status: true, color: 'bg-green-500' },
                                    ].map(({ label, status, color }, i) => (
                                        <motion.div
                                            key={label}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 + i * 0.06 }}
                                            className="flex items-center justify-between py-2"
                                        >
                                            <span className="text-xs text-foreground/50">{label}</span>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_6px_rgba(34,197,94,0.5)]`} />
                                                <span className="text-[10px] font-bold text-green-400/70 uppercase">Online</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Stream Info */}
                            <div className="glass p-6 rounded-[28px] border border-foreground/10 space-y-5">
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                    Stream Info
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { icon: Users, label: 'Status', value: stream?.isLive ? '🔴 LIVE' : 'Offline', highlight: stream?.isLive },
                                        { icon: Clock, label: 'Created', value: stream?.createdAt ? new Date(stream.createdAt).toLocaleDateString() : '—' },
                                        { icon: Tv, label: 'Stream ID', value: stream?._id?.slice(-8) || '—', mono: true },
                                    ].map(({ icon: Icon, label, value, highlight, mono }) => (
                                        <div key={label} className="flex items-center justify-between py-2 border-b border-foreground/5 last:border-0">
                                            <span className="text-xs text-foreground/40 flex items-center gap-2">
                                                <Icon className="w-3.5 h-3.5" /> {label}
                                            </span>
                                            <span className={`text-xs font-semibold ${highlight ? 'text-red-400' : 'text-foreground/50'} ${mono ? 'font-mono' : ''}`}>
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="glass p-6 rounded-[28px] border border-foreground/10 space-y-4">
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/40">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => navigate('/live')}
                                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all"
                                    >
                                        <Radio className="w-4 h-4" />
                                        <span className="text-xs font-bold">Open Stream Page</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => copyToClipboard(`${window.location.origin}/live`, 'Stream Link')}
                                        className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-foreground/[0.04] border border-foreground/10 text-foreground/60 hover:bg-foreground/[0.07] transition-all"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span className="text-xs font-bold">Copy Stream Link</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreamerDashboard;
