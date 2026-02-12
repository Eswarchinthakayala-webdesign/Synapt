import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChevronRight, Shield, Zap, Activity, Info, Lock, Globe, Terminal, ArrowRight } from 'lucide-react';
import { NeuralNetwork } from './NeuralNetwork';
import { Link } from 'react-router-dom';

export const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 md:pb-40 bg-background overflow-hidden selection:bg-primary/20" id="hero">
            <NeuralNetwork />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full glass border border-foreground/10 text-foreground/40 text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-8 sm:mb-10 md:mb-12"
                    >
                        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary animate-pulse" />
                        <span className="hidden sm:inline">Synapt Guardian Active Protocol</span>
                        <span className="sm:hidden">Guardian Protocol</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-[9rem] font-bold tracking-tighter mb-6 sm:mb-8 md:mb-12 leading-[0.9] sm:leading-[0.85] italic relative"
                    >
                        <span className="relative z-10 text-foreground">Suppress</span> <br /> 
                        <span className="text-foreground/10 not-italic font-black">Toxic Noise.</span>
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-primary/10 blur-[80px] md:blur-[120px] h-20 md:h-32 rounded-full opacity-20 -z-10 animate-pulse"></div>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-base sm:text-lg md:text-xl text-foreground/40 mb-10 sm:mb-12 md:mb-16 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto font-light leading-relaxed tracking-tight px-2"
                    >
                        Real-time spam detection and automated user suppression for high-frequency streams. Powered by the Synapt Guardian core.
                    </motion.p>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16 sm:mb-24 md:mb-32 px-4"
                    >
                        <Link to="/live" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-[10px] font-black tracking-[0.3em] uppercase bg-foreground text-background hover:scale-105 active:scale-95 transition-all rounded-[20px] sm:rounded-[24px] shadow-2xl overflow-hidden group">
                                <span className="relative z-10 flex items-center gap-2">
                                    Initialize Link
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            </Button>
                        </Link>
                        <Button variant="outline" className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-[10px] font-black tracking-[0.3em] uppercase group rounded-[20px] sm:rounded-[24px] glass border-foreground/10 hover:bg-foreground/[0.05] transition-all">
                            <Info className="mr-2 sm:mr-3 w-4 h-4 opacity-40" />
                            Technical Specs
                        </Button>
                    </motion.div>

                    {/* Dashboard Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group px-2 sm:px-4 md:px-8 lg:px-20"
                    >
                        {/* Glow effects */}
                        <div className="absolute -inset-10 bg-primary/5 blur-[100px] md:blur-[150px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        
                        <div className="relative glass border border-white/5 rounded-[24px] sm:rounded-[40px] md:rounded-[56px] lg:rounded-[64px] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] md:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.5)] bg-background/20 backdrop-blur-3xl p-0.5 sm:p-1">
                            {/* Window Header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-5 md:py-8 border-b border-white/5">
                                <div className="flex gap-2 sm:gap-3 md:gap-4">
                                    {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-foreground/10"></div>)}
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <div className="hidden sm:block text-[8px] sm:text-[9px] font-bold tracking-[0.3em] md:tracking-[0.4em] text-foreground/40 uppercase">Guardian_Shield_v4.2.0</div>
                                    <div className="hidden md:block h-4 w-px bg-white/5"></div>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[7px] sm:text-[8px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                                    </div>
                                </div>
                                <div className="w-4 sm:w-8"></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0.5 sm:gap-1 p-0.5 sm:p-1">
                                {/* Left Panel - Metrics */}
                                <div className="lg:col-span-4 p-5 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8 bg-foreground/[0.01]">
                                    <div className="space-y-4 sm:space-y-6">
                                        <div className="text-[9px] sm:text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-muted-foreground uppercase">Real-Time Metrics</div>
                                        <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                                            {[
                                                { label: "Suppression Rate", value: "99.8%", icon: Zap },
                                                { label: "Filtering Latency", value: "0.4ms", icon: Activity },
                                                { label: "Active Nodes", value: "1,248", icon: Globe }
                                            ].map((stat, i) => (
                                                <div key={i} className="flex items-center justify-between p-3.5 sm:p-4 md:p-5 lg:p-6 rounded-[16px] sm:rounded-[20px] md:rounded-[28px] lg:rounded-[32px] glass-dark border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                                                        <stat.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary opacity-40" />
                                                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-foreground/40">{stat.label}</span>
                                                    </div>
                                                    <span className="text-xs sm:text-sm font-black italic tracking-tighter">{stat.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel - Threat Analysis */}
                                <div className="lg:col-span-8 p-5 sm:p-6 md:p-8 lg:p-10 bg-foreground/[0.02] relative overflow-hidden group/panel text-left">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                        <Terminal className="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] -rotate-12" />
                                    </div>
                                    
                                    <div className="flex flex-col h-full justify-between relative z-10">
                                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-primary/10 border border-primary/20">
                                                <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary animate-pulse" />
                                                <span className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em]">Live Threat Analysis</span>
                                            </div>
                                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter max-w-xl leading-[1.05] sm:leading-none italic pb-3 sm:pb-4 border-b border-white/5">
                                                Autonomous Suppression of repetitive and malformed content.
                                            </h3>
                                        </div>
                                        
                                        <div className="pt-8 sm:pt-12 md:pt-16 lg:pt-20 grid grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                                <div className="text-[8px] sm:text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Detection Pulse</div>
                                                <div className="h-8 sm:h-10 md:h-12 flex items-center gap-0.5 sm:gap-1">
                                                    {Array.from({ length: 16 }).map((_, i) => (
                                                        <motion.div 
                                                            key={i}
                                                            animate={{ height: [8, Math.random() * 30 + 8, 8] }}
                                                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.05 }}
                                                            className="w-0.5 sm:w-1 bg-primary/40 rounded-full"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                                <div className="text-[8px] sm:text-[9px] font-bold text-foreground/30 uppercase tracking-[0.2em] sm:tracking-[0.3em]">System Uptime</div>
                                                <div className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tighter italic text-foreground/80">99.999%</div>
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
                            className="absolute -top-8 sm:-top-12 md:-top-16 -right-2 sm:-right-6 md:-right-12 p-4 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[28px] md:rounded-[32px] glass border border-white/20 shadow-2xl z-20 hidden md:block backdrop-blur-2xl"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-foreground/30">Protocol</div>
                                    <div className="text-xs sm:text-sm font-black italic tracking-tighter">SECURED-X42</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 sm:h-60 md:h-80 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"></div>
        </section>
    );
};
