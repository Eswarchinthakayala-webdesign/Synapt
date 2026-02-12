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
        <section className="py-40 bg-background overflow-hidden noise-bg" id="ai-engine">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="relative z-10 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-foreground/10 text-foreground/50 text-[10px] font-bold tracking-[0.4em] uppercase"
                        >
                            <Cpu className="w-4 h-4 text-primary animate-pulse" />
                            Guardian.core.v4.2.0
                        </motion.div>
                        
                        <div className="space-y-6">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-7xl font-bold leading-tight italic tracking-tighter"
                            >
                                Guardian Core. <br />
                                <span className="opacity-30 text-foreground">Active Suppression.</span>
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-foreground/50 text-xl font-light leading-relaxed max-w-lg"
                            >
                                Synapt's moderation engine doesn't just filter. It eliminates toxic noise at silicon speed, preserving the integrity of your live stream.
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {engineStats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-3xl glass-dark border border-foreground/5 space-y-3"
                                >
                                    <stat.icon className="w-5 h-5 opacity-40" />
                                    <div className="space-y-1">
                                        <div className="text-2xl font-bold tracking-tighter">{stat.value}</div>
                                        <div className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-20 bg-foreground/10 blur-[140px] rounded-full opacity-20 animate-pulse-slow"></div>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative lg:h-[550px] rounded-[40px] border border-foreground/10 overflow-hidden shadow-[0_0_100px_rgba(var(--foreground),0.05)]"
                        >
                            {/* Terminal Window */}
                            <div className="flex items-center justify-between px-8 py-5 border-b border-foreground/5 bg-foreground/[0.02]">
                                <div className="flex gap-2.5">
                                    <div className="w-3 h-3 rounded-full bg-foreground/10"></div>
                                    <div className="w-3 h-3 rounded-full bg-foreground/10"></div>
                                    <div className="w-3 h-3 rounded-full bg-foreground/10"></div>
                                </div>
                                <div className="text-[10px] font-mono text-foreground/40 tracking-widest uppercase">
                                    moderation_core_beta.sh
                                </div>
                            </div>

                            <div className="p-10 font-mono text-sm leading-relaxed h-[400px] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={codeIndex}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.5 }}
                                        className="text-foreground/60"
                                    >
                                        <pre className="whitespace-pre-wrap">
                                            {codeSnippets[codeIndex]}
                                        </pre>
                                    </motion.div>
                                </AnimatePresence>
                                
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                    className="w-2 h-4 bg-foreground/40 mt-4"
                                ></motion.div>
                            </div>

                            {/* Internal HUD element */}
                            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                                <div className="space-y-4">
                                    <div className="h-0.5 w-32 bg-foreground/10 overflow-hidden">
                                        <motion.div
                                            animate={{ x: [-128, 128] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                            className="h-full w-full bg-foreground/50"
                                        ></motion.div>
                                    </div>
                                    <div className="text-[9px] text-foreground/20 font-bold tracking-widest">ENCRYPTION LEVEL: HIGH</div>
                                </div>
                                <div className="w-16 h-16 rounded-full border border-foreground/10 flex items-center justify-center border-dashed animate-spin-slow">
                                    <Terminal className="w-6 h-6 opacity-20" />
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Floating Micro-interface */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-8 p-6 rounded-3xl glass border border-foreground/20 backdrop-blur-3xl shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-foreground flex items-center justify-center">
                                    <Shield className="text-background w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-foreground/40 tracking-widest">STATUS</div>
                                    <div className="text-lg font-bold">PROTECTED</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
