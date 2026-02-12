import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Shield, Zap, Layers, Lock } from 'lucide-react';

const engineStats = [
    { label: "Guardian Spam Shield", value: "0.8ms", icon: Zap },
    { label: "Detection Acc.", value: "99.9%", icon: Shield },
    { label: "Active Blocks", value: "1,242", icon: Lock },
];

const codeSnippets = [
    `>>> Initializing Moderation Core...
[SYSTEM] Redis: CONNECTED
[SYSTEM] MongoDB: SYNCED
[CORE] Pattern: ACTIVE
[CORE] Anti-Flood: ENABLED`,
    `>>> Running Similarity Analysis
IF (string_sim(msg, history) > 0.90) {
    user.block();
    emit('user_blocked', user.id);
    log.save('SIMILARITY_VIOLATION');
}`,
    `>>> Monitoring Socket Flood
COUNT = history.filter(t > now - 5s);
IF (COUNT >= 8) {
    status = 'SUSPENDED';
    protocol.execute(user.id);
    >>> User 0x1f blocked.`
];

export const AIEngine = () => {
    const [codeIndex, setCodeIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 sm:py-28 md:py-32 lg:py-40 bg-background overflow-hidden noise-bg" id="ai-engine">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center">
                    <div className="relative z-10 space-y-8 sm:space-y-10 md:space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full glass border border-foreground/10 text-foreground/50 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase"
                        >
                            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary animate-pulse" />
                            Guardian.core.v4.2.0
                        </motion.div>
                        
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight italic tracking-tighter"
                            >
                                Guardian Core. <br />
                                <span className="opacity-30 text-foreground">Active Suppression.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-foreground/50 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-lg"
                            >
                                Synapt's moderation engine doesn't just filter. It eliminates toxic noise at silicon speed, preserving the integrity of your live stream.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                            {engineStats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-4 sm:p-5 md:p-6 rounded-[18px] sm:rounded-[22px] md:rounded-3xl glass-dark border border-foreground/5 space-y-2 sm:space-y-3"
                                >
                                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />
                                    <div className="space-y-0.5 sm:space-y-1">
                                        <div className="text-xl sm:text-2xl font-bold tracking-tighter">{stat.value}</div>
                                        <div className="text-[8px] sm:text-[9px] uppercase tracking-wider sm:tracking-widest text-foreground/30 font-bold">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-10 sm:-inset-20 bg-foreground/10 blur-[80px] sm:blur-[140px] rounded-full opacity-20 animate-pulse-slow"></div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative h-[350px] sm:h-[400px] md:h-[480px] lg:h-[550px] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] border border-foreground/10 overflow-hidden shadow-[0_0_60px_rgba(var(--foreground),0.03)] sm:shadow-[0_0_100px_rgba(var(--foreground),0.05)]"
                        >
                            {/* Terminal Window */}
                            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 border-b border-foreground/5 bg-foreground/[0.02]">
                                <div className="flex gap-1.5 sm:gap-2 md:gap-2.5">
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-foreground/10"></div>
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-foreground/10"></div>
                                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-foreground/10"></div>
                                </div>
                                <div className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-foreground/40 tracking-wider sm:tracking-widest uppercase">
                                    moderation_core.sh
                                </div>
                            </div>

                            <div className="p-5 sm:p-7 md:p-8 lg:p-10 font-mono text-xs sm:text-sm leading-relaxed h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={codeIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-foreground/60"
                                    >
                                        <pre className="whitespace-pre-wrap text-[11px] sm:text-xs md:text-sm">
                                            {codeSnippets[codeIndex]}
                                        </pre>
                                    </motion.div>
                                </AnimatePresence>
                                
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-1.5 sm:w-2 h-3 sm:h-4 bg-foreground/40 mt-3 sm:mt-4"
                                ></motion.div>
                            </div>

                            {/* Internal HUD element */}
                            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-4 sm:left-6 md:left-8 lg:left-10 right-4 sm:right-6 md:right-8 lg:right-10 flex justify-between items-end">
                                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                    <div className="h-0.5 w-20 sm:w-24 md:w-32 bg-foreground/10 overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-128, 128] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="h-full w-full bg-foreground/50"
                                        ></motion.div>
                                    </div>
                                    <div className="text-[7px] sm:text-[8px] md:text-[9px] text-foreground/20 font-bold tracking-widest">ENCRYPTION: HIGH</div>
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border border-foreground/10 flex items-center justify-center border-dashed animate-spin-slow">
                                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 opacity-20" />
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Floating Micro-interface */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-4 sm:-bottom-6 md:-bottom-8 -left-2 sm:-left-4 md:-left-8 p-3 sm:p-4 md:p-6 rounded-[18px] sm:rounded-[22px] md:rounded-3xl glass border border-foreground/20 backdrop-blur-3xl shadow-2xl hidden sm:block"
                        >
                            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-foreground flex items-center justify-center">
                                    <Shield className="text-background w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <div className="text-[8px] sm:text-[10px] md:text-xs font-bold text-foreground/40 tracking-wider sm:tracking-widest">STATUS</div>
                                    <div className="text-sm sm:text-base md:text-lg font-bold">PROTECTED</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
