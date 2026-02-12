import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight, Shield, Zap, Activity, Info, Lock, Globe, Terminal } from 'lucide-react';
import { NeuralNetwork } from './NeuralNetwork';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-40 bg-background overflow-hidden selection:bg-primary/20" id="hero">
            <NeuralNetwork />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-foreground/10 text-foreground/40 text-[10px] font-black tracking-[0.4em] uppercase mb-12"
                    >
                        <Shield className="w-3.5 h-3.5 text-primary animate-pulse" />
                        Synapt Guardian Active Protocol
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-7xl md:text-[9rem] font-bold tracking-tighter mb-12 leading-[0.85] italic relative"
                    >
                        <span className="relative z-10 text-foreground">Suppress</span> <br /> 
                        <span className="text-foreground/10 not-italic font-black">Toxic Noise.</span>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-primary/10 blur-[120px] h-32 rounded-full opacity-20 -z-10 animate-pulse"></div>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-lg md:text-xl text-foreground/40 mb-16 max-w-2xl mx-auto font-light leading-relaxed tracking-tight"
                    >
                        Real-time spam detection and automated user suppression for high-frequency streams. Powered by the Synapt Guardian core.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32"
                    >
                        <Link to="/live">
                            <Button size="lg" className="h-16 px-12 text-[10px] font-black tracking-[0.3em] uppercase bg-foreground text-background hover:scale-105 active:scale-95 transition-all rounded-[24px] shadow-2xl overflow-hidden group">
                                <span className="relative z-10">Initialize Link</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </Button>
                        </Link>
                        <Button variant="outline" className="h-16 px-12 text-[10px] font-black tracking-[0.3em] uppercase group rounded-[24px] glass border-foreground/10 hover:bg-foreground/[0.05] transition-all">
                            <Info className="mr-3 w-4 h-4 opacity-40" />
                            Technical Specs
                        </Button>
                    </motion.div>

                    {/* Dashboard Mockup - High Tech Aesthetic */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group lg:px-20"
                    >
                        {/* Glow effects */}
                        <div className="absolute -inset-10 bg-primary/5 blur-[150px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        
                        <div className="relative glass border border-white/5 rounded-[64px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] bg-background/20 backdrop-blur-3xl p-1">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-10 py-8 border-b border-white/5">
                                <div className="flex gap-4">
                                    {[1, 2, 3].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-foreground/10"></div>)}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-[9px] font-bold tracking-[0.4em] text-foreground/40 uppercase">Guardian_Shield_v4.2.0</div>
                                    <div className="h-4 w-px bg-white/5"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Active Status</span>
                                    </div>
                                </div>
                                <div className="w-8"></div>
                            </div>

                            <div className="grid grid-cols-12 gap-1 p-1">
                                {/* Dashboard Sections */}
                                <div className="col-span-12 lg:col-span-4 p-10 space-y-8 bg-foreground/[0.01]">
                                    <div className="space-y-6">
                                        <div className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">Real-Time Metrics</div>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Suppression Rate", value: "99.8%", icon: Zap },
                                                { label: "Filtering Latency", value: "0.4ms", icon: Activity },
                                                { label: "Active Nodes", value: "1,248", icon: Globe }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 rounded-[32px] glass-dark border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <stat.icon className="w-4 h-4 text-primary opacity-40" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{stat.label}</span>
                                                    </div>
                                                    <span className="text-sm font-black italic tracking-tighter">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-12 lg:col-span-8 p-10 bg-foreground/[0.02] relative overflow-hidden group/panel text-left">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Terminal className="w-[400px] h-[400px] -rotate-12" />
                                    </div>
                                    
                                    <div className="flex flex-col h-full justify-between relative z-10">
                                        <div className="space-y-8">
                                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
                                                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Live Threat Analysis</span>
                                            </div>
                                            <h3 className="text-5xl font-bold tracking-tighter max-w-xl leading-none italic pb-4 border-b border-white/5">
                                                Autonomous Suppression of repetitive and malformed content.
                                            </h3>
                                        </div>
                                        
                                        <div className="pt-20 grid grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.3em]">Detection Pulse</div>
                                                <div className="h-12 flex items-center gap-1">
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <motion.div 
                                                            key={i}
                                                            animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                                                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                                                            className="w-1 bg-primary/40 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="text-[9px] font-bold text-foreground/30 uppercase tracking-[0.3em]">System Uptime</div>
                                                <div className="text-4xl font-black font-mono tracking-tighter italic text-foreground/80">99.999%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Micro-UI for Depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -top-16 -right-12 p-8 rounded-[32px] glass border border-white/20 shadow-2xl z-20 hidden lg:block backdrop-blur-2xl"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <Lock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-foreground/30">Protocol</div>
                                    <div className="text-sm font-black italic tracking-tighter">SECURED-X42</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};
