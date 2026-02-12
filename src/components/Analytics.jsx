import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, Zap, Shield, Info, Layers } from 'lucide-react';

const moderationData = [
    { name: '00:00', spam: 400, mitigation: 400 },
    { name: '04:00', spam: 300, mitigation: 298 },
    { name: '08:00', spam: 800, mitigation: 799 },
    { name: '12:00', spam: 1200, mitigation: 1198 },
    { name: '16:00', spam: 2400, mitigation: 2399 },
    { name: '20:00', spam: 900, mitigation: 900 },
    { name: '23:59', spam: 200, mitigation: 200 },
];

export const Analytics = () => {
    return (
        <section className="py-40 bg-background noise-bg" id="analytics">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-32 items-center">
                    <div className="lg:col-span-4 space-y-12">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-foreground/30"
                            >
                                <Activity className="w-3 h-3" />
                                Moderation Telemetry
                            </motion.div>
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-bold tracking-tight italic"
                            >
                                Real-time <br />
                                <span className="opacity-20 font-light">Mitigation.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-foreground/50 text-xl font-light leading-relaxed"
                            >
                                Analytics that track the heartbeat of your community. Synapt maps threat vectors to system responses, ensuring zero toxic infiltration with 99.9% precision.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <motion.div 
                                whileHover={{ x: 10 }}
                                className="p-8 rounded-[40px] glass border border-foreground/5 flex items-center justify-between group cursor-help"
                            >
                                <div className="space-y-1">
                                    <div className="text-xs font-bold tracking-[0.2em] text-foreground/30 uppercase">Spam Mitigation Rate</div>
                                    <div className="text-4xl font-bold tracking-tighter">99.9<span className="text-lg opacity-20">%</span></div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shadow-2xl">
                                    <Shield className="text-background w-7 h-7" />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ x: -10 }}
                                className="p-8 rounded-[40px] glass-dark border border-foreground/5 flex items-center justify-between group"
                            >
                                <div className="space-y-1">
                                    <div className="text-xs font-bold tracking-[0.2em] text-foreground/30 uppercase">System Uptime</div>
                                    <div className="text-4xl font-bold tracking-tighter">100%</div>
                                </div>
                                <div className="w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center p-1">
                                    <div className="w-full h-full rounded-full border border-foreground/20 border-dashed animate-spin-slow flex items-center justify-center">
                                        <Zap className="w-6 h-6 opacity-40 rotate-12" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-12 rounded-[60px] glass border border-foreground/10 shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden backdrop-blur-2xl"
                        >
                            <div className="flex items-center justify-between mb-16 px-4">
                                <div>
                                    <h4 className="text-3xl font-bold tracking-tighter italic">Guardian Intelligence</h4>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex gap-1">
                                            {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-foreground/20 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                                        </div>
                                        <p className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest mt-1">Pattern recognition vs. Spam Volume</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-foreground/[0.05] text-[10px] font-bold text-foreground/40 uppercase tracking-widest border border-foreground/10">
                                        <Layers className="w-3 h-3" /> Filters
                                    </div>
                                    <div className="px-6 py-2.5 rounded-2xl bg-foreground text-background text-[10px] font-bold uppercase tracking-widest shadow-2xl">Export Logs</div>
                                </div>
                            </div>

                            <div className="h-[450px] w-full px-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={moderationData}>
                                        <defs>
                                            <linearGradient id="colorSpam" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="currentColor" stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorMitigation" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="currentColor" stopOpacity={0.05}/>
                                                <stop offset="95%" stopColor="currentColor" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="currentColor" className="text-foreground/[0.03]" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: 'currentColor', fontSize: 10, opacity: 0.2, fontWeight: 700}}
                                            dy={20}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: 'var(--background)', backdropFilter: 'blur(20px)', border: '1px solid var(--foreground-opacity-10)', borderRadius: '24px', padding: '16px 20px'}}
                                            itemStyle={{color: 'var(--foreground)', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase'}}
                                            cursor={{stroke: 'currentColor', strokeWidth: 1, strokeOpacity: 0.1}}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="spam" 
                                            stroke="currentColor" 
                                            className="text-foreground"
                                            strokeWidth={3} 
                                            fillOpacity={1} 
                                            fill="url(#colorSpam)" 
                                            strokeDasharray="5 5"
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="mitigation" 
                                            stroke="currentColor" 
                                            strokeWidth={1} 
                                            strokeOpacity={0.2}
                                            fillOpacity={1} 
                                            fill="url(#colorMitigation)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-16 grid grid-cols-3 gap-12 pt-12 border-t border-foreground/10 px-4 relative">
                                <div className="absolute top-0 right-12 -translate-y-1/2 p-2 glass rounded-xl border-foreground/20">
                                    <Info className="w-3.5 h-3.5 opacity-20" />
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[9px] uppercase font-bold tracking-[0.2em] mb-3">Community Hygiene</div>
                                    <div className="text-2xl font-bold tracking-tighter flex items-center gap-3">
                                        +18.2% <TrendingUp className="w-5 h-5 text-foreground/40" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[9px] uppercase font-bold tracking-[0.2em] mb-3">Auto-Suppressed</div>
                                    <div className="text-2xl font-bold tracking-tighter italic">4,102k</div>
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[9px] uppercase font-bold tracking-[0.2em] mb-3">Avg Detection</div>
                                    <div className="text-2xl font-bold tracking-tighter">0.82ms</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
