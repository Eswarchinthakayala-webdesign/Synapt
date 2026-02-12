import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Lock, LogOut, Terminal, Activity, AlertTriangle, Eye, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { io } from 'socket.io-client';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_SERVER_URL || 'https://synapt-server.onrender.com';

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        activeViewers: 0,
        totalBlocked: 0,
        spamAlerts: 0
    });
    const [logs, setLogs] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, logsRes] = await Promise.all([
                fetch(`${API_URL}/api/moderation/stats`),
                fetch(`${API_URL}/api/moderation/logs`)
            ]);
            
            const statsData = await statsRes.json();
            const logsData = await logsRes.json();

            setStats(prev => ({
                ...prev,
                totalBlocked: statsData.totalBlocked,
                spamAlerts: statsData.totalLogs
            }));
            setLogs(logsData);
            setLoading(false);
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to synchronize with Logic Core");
        }
    };

    useEffect(() => {
        fetchData();

        const socket = io(API_URL);

        socket.on('connect', () => {
            console.log('>>> Admin Connected to Neural Link');
        });

        // Listen for real-time viewer updates
        socket.on('viewer_count', (count) => {
            setStats(prev => ({ ...prev, activeViewers: count }));
        });

        // Listen for real-time moderation events
        socket.on('user_blocked', (data) => {
            // Update Stats
            setStats(prev => ({ 
                ...prev, 
                totalBlocked: prev.totalBlocked + 1,
                spamAlerts: prev.spamAlerts + 1 
            }));

            // Add to live alerts
            const newAlert = {
                id: Math.random(),
                type: "CRITICAL",
                msg: `Neural breach by ${data.username}: ${data.reason}`,
                time: "JUST NOW"
            };
            setAlerts(prev => [newAlert, ...prev].slice(0, 5));
            
            // Refresh logs
            fetchData();
            
            toast.warning(`System Alert: ${data.username} suppressed for ${data.reason}`);
        });

        return () => socket.disconnect();
    }, []);

    const unblockUser = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/api/moderation/unblock/${userId}`, {
                method: 'POST'
            });
            if (res.ok) {
                toast.success("User link restored");
                fetchData();
            }
        } catch (err) {
            toast.error("Override failed");
        }
    };

    return (
        <div className="min-h-screen bg-background pt-24 pb-12 px-6 selection:bg-primary/20">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full glass border border-foreground/10 text-foreground/40 text-[10px] font-bold tracking-[0.4em] uppercase">
                            <Shield className="w-3 h-3 text-primary animate-pulse" />
                            Admin Moderation Core
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold italic tracking-tighter leading-none">Live Monitor.</h1>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            variant="ghost" 
                            onClick={fetchData}
                            className="rounded-2xl glass border-foreground/10 px-6 font-bold uppercase tracking-widest text-[10px] h-12"
                        >
                            <RefreshCcw className="w-3 h-3 mr-2" /> Sync Core
                        </Button>
                        <Button className="rounded-2xl bg-foreground text-background px-8 font-bold uppercase tracking-widest text-[10px] h-12 shadow-2xl">
                            System Overload
                        </Button>
                    </div>
                </div>

                {/* System Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Neural Nodes (Viewers)", value: stats.activeViewers || "---", icon: Users, color: "text-blue-400" },
                        { label: "Suppressed Links (Blocked)", value: stats.totalBlocked, icon: Lock, color: "text-red-400" },
                        { label: "Filtering Events (Logs)", value: stats.spamAlerts, icon: Activity, color: "text-amber-400" }
                    ].map((s, i) => (
                        <motion.div 
                            key={i}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-[40px] glass border border-foreground/5 space-y-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <s.icon className="w-32 h-32" />
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center border border-foreground/10">
                                <s.icon className={`w-7 h-7 ${s.color} opacity-80`} />
                            </div>
                            <div className="space-y-1">
                                <div className="text-4xl font-bold tracking-tighter font-mono">{s.value}</div>
                                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-foreground/20">{s.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Moderation Logs */}
                    <div className="lg:col-span-8 p-10 glass rounded-[60px] border border-foreground/10 space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Terminal className="w-6 h-6 opacity-40 text-primary" />
                                <h2 className="text-xl font-bold tracking-tighter italic">Moderation History</h2>
                            </div>
                            <Button variant="link" className="text-foreground/40 font-bold uppercase tracking-widest text-[10px]">Real-Time Feed</Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-foreground/5 font-bold uppercase tracking-widest text-[10px] text-foreground/20">
                                    <tr>
                                        <th className="pb-6">Subject</th>
                                        <th className="pb-6">Violation</th>
                                        <th className="pb-6">Protocol</th>
                                        <th className="pb-6">Timestamp</th>
                                        <th className="pb-6">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-20 text-center opacity-20 font-bold uppercase tracking-[0.3em]">No Incidents Recorded</td>
                                        </tr>
                                    ) : (
                                        logs.map(log => (
                                            <motion.tr 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={log._id} 
                                                className="border-b border-foreground/[0.02] last:border-0 group hover:bg-foreground/[0.01] transition-colors"
                                            >
                                                <td className="py-6 pr-4">
                                                    <div className="font-bold italic tracking-tighter text-lg">{log.userId?.username || "Unknown Link"}</div>
                                                    <div className="text-[9px] font-mono opacity-20 truncate w-32">{log.userId?._id}</div>
                                                </td>
                                                <td className="py-6 text-foreground/50">{log.reason}</td>
                                                <td className="py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${log.action === 'TEMPORARY_MUTE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="py-6 text-foreground/30 font-mono text-xs">
                                                    {new Date(log.createdAt).toLocaleTimeString()}
                                                </td>
                                                <td className="py-6">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        onClick={() => unblockUser(log.userId?._id)}
                                                        className="h-8 w-8 p-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Live Alerts */}
                    <div className="lg:col-span-4 p-10 glass-dark rounded-[60px] border border-foreground/5 space-y-10">
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="w-6 h-6 text-amber-500 opacity-60" />
                            <h2 className="text-xl font-bold tracking-tighter italic text-amber-500/80">Real-Time Alerts</h2>
                        </div>

                        <div className="space-y-6">
                            <AnimatePresence>
                                {alerts.length === 0 ? (
                                    <div className="py-10 text-center opacity-10">
                                        <div className="text-[10px] font-bold uppercase tracking-widest">Scanning...</div>
                                    </div>
                                ) : (
                                    alerts.map(alert => (
                                        <motion.div 
                                            key={alert.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 space-y-3 relative overflow-hidden group shadow-xl"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/[0.05] to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[8px] font-black tracking-[0.4em] uppercase ${alert.type === 'CRITICAL' ? 'text-red-500' : 'text-amber-500'}`}>{alert.type}</span>
                                                <span className="text-[8px] opacity-20 font-mono uppercase">{alert.time}</span>
                                            </div>
                                            <p className="text-xs font-light text-foreground/60 leading-relaxed pr-8">{alert.msg}</p>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="pt-10 space-y-4 border-t border-foreground/5 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground/20">System Integrity: 100%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

