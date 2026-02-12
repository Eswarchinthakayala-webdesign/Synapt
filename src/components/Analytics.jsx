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
        <section className="py-20 sm:py-28 md:py-32 lg:py-40 bg-background noise-bg" id="analytics">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 md:gap-20 lg:gap-24 xl:gap-32 items-center">
                    <div className="lg:col-span-4 space-y-8 sm:space-y-10 md:space-y-12">
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="inline-flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-foreground/30"
                            >
                                <Activity className="w-3 h-3" />
                                Moderation Telemetry
                            </motion.div>
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight italic"
                            >
                                Real-time <br />
                                <span className="opacity-20 font-light">Mitigation.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-foreground/50 text-base sm:text-lg md:text-xl font-light leading-relaxed"
                            >
                                Analytics that track the heartbeat of your community. Synapt maps threat vectors to system responses, ensuring zero toxic infiltration with 99.9% precision.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 md:gap-6">
                            <motion.div 
                                whileHover={{ x: 10 }}
                                className="p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] glass border border-foreground/5 flex items-center justify-between group cursor-help"
                            >
                                <div className="space-y-1">
                                    <div className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] text-foreground/30 uppercase">Spam Mitigation Rate</div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">99.9<span className="text-base sm:text-lg opacity-20">%</span></div>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-foreground flex items-center justify-center shadow-xl sm:shadow-2xl">
                                    <Shield className="text-background w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ x: -10 }}
                                className="p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] glass-dark border border-foreground/5 flex items-center justify-between group"
                            >
                                <div className="space-y-1">
                                    <div className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] text-foreground/30 uppercase">System Uptime</div>
                                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">100%</div>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border border-foreground/10 flex items-center justify-center p-0.5 sm:p-1">
                                    <div className="w-full h-full rounded-full border border-foreground/20 border-dashed animate-spin-slow flex items-center justify-center">
                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 opacity-40 rotate-12" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-[24px] sm:rounded-[36px] md:rounded-[48px] lg:rounded-[60px] glass border border-foreground/10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] md:shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative overflow-hidden backdrop-blur-2xl"
                        >
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-1 sm:px-2 md:px-4 gap-4 sm:gap-0">
                                <div>
                                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tighter italic">Guardian Intelligence</h4>
                                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                                        <div className="flex gap-0.5 sm:gap-1">
                                            {[1,2,3].map(i => <div key={i} className="w-0.5 sm:w-1 h-2 sm:h-3 bg-foreground/20 rounded-full animate-pulse" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                                        </div>
                                        <p className="text-foreground/30 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest mt-0.5 sm:mt-1">Pattern recognition vs. Spam Volume</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:gap-3 md:gap-4">
                                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-foreground/[0.05] text-[8px] sm:text-[9px] md:text-[10px] font-bold text-foreground/40 uppercase tracking-wider sm:tracking-widest border border-foreground/10">
                                        <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Filters
                                    </div>
                                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-foreground text-background text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest shadow-xl sm:shadow-2xl">Export</div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="h-[250px] sm:h-[300px] md:h-[380px] lg:h-[450px] w-full px-0 sm:px-2 md:px-4">
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
                                            tick={{fill: 'currentColor', fontSize: 9, opacity: 0.2, fontWeight: 700}}
                                            dy={15}
                                        />
                                        <YAxis hide />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: 'var(--background)', backdropFilter: 'blur(20px)', border: '1px solid var(--foreground-opacity-10)', borderRadius: '16px', padding: '12px 16px'}}
                                            itemStyle={{color: 'var(--foreground)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase'}}
                                            cursor={{stroke: 'currentColor', strokeWidth: 1, strokeOpacity: 0.1}}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="spam" 
                                            stroke="currentColor" 
                                            className="text-foreground"
                                            strokeWidth={2} 
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

                            {/* Bottom Stats */}
                            <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 pt-6 sm:pt-8 md:pt-10 lg:pt-12 border-t border-foreground/10 px-1 sm:px-2 md:px-4 relative">
                                <div className="absolute top-0 right-4 sm:right-8 md:right-12 -translate-y-1/2 p-1.5 sm:p-2 glass rounded-lg sm:rounded-xl border-foreground/20">
                                    <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-20" />
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[7px] sm:text-[8px] md:text-[9px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2 md:mb-3">Community Hygiene</div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter flex items-center gap-1.5 sm:gap-2 md:gap-3">
                                        +18.2% <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground/40" />
                                    </div>
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[7px] sm:text-[8px] md:text-[9px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2 md:mb-3">Auto-Suppressed</div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter italic">4,102k</div>
                                </div>
                                <div>
                                    <div className="text-foreground/30 text-[7px] sm:text-[8px] md:text-[9px] uppercase font-bold tracking-[0.15em] sm:tracking-[0.2em] mb-1.5 sm:mb-2 md:mb-3">Avg Detection</div>
                                    <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter">0.82ms</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
