import React from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Zap, 
    Lock, 
    Activity, 
    MessageSquare, 
    Eye, 
    ArrowUpRight,
    Cpu,
    Video
} from 'lucide-react';

const features = [
    {
        title: "Guardian Spam Shield",
        desc: "Advanced logic core that detects repetition, message floods, and toxic bot patterns in real-time.",
        icon: Shield,
        badge: "Critical"
    },
    {
        title: "Similarity Analysis",
        desc: "High-precision string similarity detection (≥90%) ensures bot variants are caught instantly.",
        icon: Cpu,
        badge: "AI Core"
    },
    {
        title: "HLS.js Live Streaming",
        desc: "Ultra-low latency streaming with HLS and WebRTC support for seamless audience reach.",
        icon: Video,
        badge: "Beta"
    },
    {
        title: "Automated Blocking",
        desc: "Instant system-level blocks for repeated violations, synchronized across all active feeds.",
        icon: Lock,
        badge: "Sync"
    },
    {
        title: "Admin Moderation HUD",
        desc: "A professional-grade command panel for manual overrides and real-time spam telemetry.",
        icon: Activity,
        badge: "Enterprise"
    },
    {
        title: "Shadow Ban Protocols",
        desc: "Invisible containment for disruptive actors, preserving the ecosystem without escalation.",
        icon: Eye,
        badge: "New"
    }
];

export const Features = () => {
    return (
        <section className="py-40 bg-background relative selection:bg-primary/10 overflow-hidden" id="features">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_70%)] opacity-[0.03] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-32 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border border-foreground/5 text-[10px] font-black tracking-[0.4em] uppercase text-primary/60"
                    >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        Guardian Infrastructure
                    </motion.div>
                    
                    <h2 className="text-6xl md:text-9xl font-bold tracking-tighter italic leading-[0.85] max-w-4xl">
                        Moderation <br />
                        <span className="text-foreground/10 not-italic font-black">Redefined.</span>
                    </h2>
                    
                    <p className="text-foreground/40 text-xl font-light leading-relaxed max-w-2xl">
                        Move beyond simple filters. Synapt is a real-time moderation powerhouse engineered for massive-scale live streaming and terminal security.
                    </p>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileActive={{ scale: 0.95 }}
                        className="flex items-center gap-4 px-10 py-5 rounded-[24px] glass border border-foreground/10 text-[10px] font-black tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-all"
                    >
                        API Documentation <ArrowUpRight className="w-5 h-5 opacity-40 shadow-sm" />
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="p-12 rounded-[56px] glass border border-white/5 dark:border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden cursor-default pb-16 bg-foreground/[0.01]"
                        >
                            {/* Feature Icon Background Glow */}
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"></div>
                            
                            <div className="flex justify-between items-start mb-14 relative z-10">
                                <div className="w-20 h-20 rounded-[32px] bg-foreground/[0.03] border border-foreground/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-2xl relative">
                                    <feature.icon className="w-10 h-10 stroke-[1.5px]" />
                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                </div>
                                {feature.badge && (
                                    <div className="px-5 py-2 rounded-full border border-foreground/5 bg-foreground/[0.02] text-[10px] font-black tracking-[0.2em] uppercase text-foreground/20 italic">
                                        {feature.badge}
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-3xl font-bold mb-4 tracking-tighter italic leading-none relative z-10 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-foreground/40 leading-relaxed font-light text-base relative z-10 pr-6">
                                {feature.desc}
                            </p>
                            
                            {/* Visual Accents */}
                            <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                                <div className="w-12 h-12 rounded-2xl border border-primary/20 flex items-center justify-center">
                                    <ArrowUpRight className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Visual Separator */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/5 to-transparent"></div>
        </section>
    );
};
