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
        <section className="py-20 sm:py-28 md:py-32 lg:py-40 bg-background relative selection:bg-primary/10 overflow-hidden" id="features">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] sm:h-[800px] md:h-[1000px] bg-[radial-gradient(circle_at_center,var(--color-primary),transparent_70%)] opacity-[0.03] pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-16 sm:mb-20 md:mb-28 lg:mb-32 space-y-4 sm:space-y-6 md:space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full glass border border-foreground/5 text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase text-primary/60"
                    >
                        <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                        Guardian Infrastructure
                    </motion.div>
                    
                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter italic leading-[0.9] sm:leading-[0.85] max-w-4xl px-2">
                        Moderation <br />
                        <span className="text-foreground/10 not-italic font-black">Redefined.</span>
                    </h2>
                    
                    <p className="text-foreground/40 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xs sm:max-w-md md:max-w-2xl px-2">
                        Move beyond simple filters. Synapt is a real-time moderation powerhouse engineered for massive-scale live streaming and terminal security.
                    </p>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileActive={{ scale: 0.95 }}
                        className="flex items-center gap-2 sm:gap-3 md:gap-4 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-[18px] sm:rounded-[20px] md:rounded-[24px] glass border border-foreground/10 text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-all"
                    >
                        API Documentation <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-40 shadow-sm" />
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -10 }}
                            className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] lg:rounded-[56px] glass border border-white/5 dark:border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden cursor-default pb-10 sm:pb-12 md:pb-14 lg:pb-16 bg-foreground/[0.01]"
                        >
                            {/* Feature Icon Background Glow */}
                            <div className="absolute -top-10 -right-10 w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"></div>
                            
                            <div className="flex justify-between items-start mb-8 sm:mb-10 md:mb-12 lg:mb-14 relative z-10">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-[16px] sm:rounded-[20px] md:rounded-[28px] lg:rounded-[32px] bg-foreground/[0.03] border border-foreground/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl sm:shadow-2xl relative">
                                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 stroke-[1.5px]" />
                                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity rounded-full"></div>
                                </div>
                                {feature.badge && (
                                    <div className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full border border-foreground/5 bg-foreground/[0.02] text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-foreground/20 italic">
                                        {feature.badge}
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tighter italic leading-none relative z-10 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-foreground/40 leading-relaxed font-light text-sm sm:text-base relative z-10 pr-2 sm:pr-4 md:pr-6">
                                {feature.desc}
                            </p>
                            
                            {/* Visual Accents */}
                            <div className="absolute bottom-6 sm:bottom-8 md:bottom-10 right-6 sm:right-8 md:right-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 duration-500">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-primary/20 flex items-center justify-center">
                                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
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
