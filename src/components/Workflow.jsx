import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Cpu, ShieldAlert, Lock, Database } from 'lucide-react';

const steps = [
    { title: "Ingest Content", icon: MessageSquare, desc: "Global Socket.IO stream intake" },
    { title: "Neural Filter", icon: Cpu, desc: "Real-time AI spam detection" },
    { title: "Violation Logic", icon: ShieldAlert, desc: "Flood & similarity tracking" },
    { title: "Instant Block", icon: Lock, desc: "Automated protocol execution" },
    { title: "Audit Persistence", icon: Database, desc: "Permanent moderation logging" }
];

const WorkflowCard = ({ step, index }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, transition: { duration: 0.2 } }}
        className="relative flex flex-col items-center gap-6 p-10 rounded-[40px] glass group z-10 w-full lg:w-64 text-center overflow-hidden"
    >
        <div className="absolute inset-0 bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="w-20 h-20 rounded-3xl bg-foreground/[0.05] border border-foreground/10 flex items-center justify-center relative overflow-hidden group-hover:bg-foreground group-hover:text-background transition-all duration-700 ease-in-out">
            <step.icon className="w-10 h-10 transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-foreground/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
        </div>
        
        <div className="space-y-2">
            <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-foreground/40 group-hover:text-foreground transition-colors duration-500">{step.title}</h3>
            <p className="text-sm text-foreground/30 font-light leading-snug group-hover:text-foreground/60 transition-colors duration-500">{step.desc}</p>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-8 h-8 opacity-10 group-hover:opacity-30 transition-opacity">
            <div className="absolute top-4 right-4 w-px h-4 bg-foreground"></div>
            <div className="absolute top-4 right-4 w-4 h-px bg-foreground"></div>
        </div>
    </motion.div>
);

export const Workflow = () => {
    return (
        <section className="py-40 relative overflow-hidden bg-background" id="workflow">
            <div className="container mx-auto px-6">
                <div className="text-center mb-32 relative">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-foreground/5 text-9xl font-bold absolute -top-16 left-1/2 -translate-x-1/2 select-none"
                    >
                        SHIELD
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter italic"
                    >
                        Moderation Protocol
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-foreground/40 text-xl max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        A recursive loop of real-time intelligence that transforms toxic chatter into a clean digital environment.
                    </motion.p>
                </div>

                <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 lg:px-6">
                    {/* SVG Connector Lines (Advanced) */}
                    <div className="absolute top-1/2 left-0 w-full h-1 hidden lg:block -translate-y-1/2 -z-0 opacity-20">
                        <svg className="w-full h-32 overflow-visible" fill="none" viewBox="0 0 1200 128">
                            <motion.path
                                d="M 50 64 Q 150 0, 250 64 T 450 64 T 650 64 T 850 64 T 1050 64 L 1150 64"
                                stroke="currentColor"
                                className="text-foreground"
                                strokeWidth="0.5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            {/* Moving dot particles along path */}
                            {[0, 0.25, 0.5, 0.75].map((start, i) => (
                                <motion.circle
                                    key={i}
                                    r="2"
                                    fill="currentColor"
                                    className="text-foreground"
                                    initial={{ offsetDistance: "0%" }}
                                    animate={{ offsetDistance: "100%" }}
                                    transition={{ 
                                        duration: 6, 
                                        repeat: Infinity, 
                                        ease: "linear",
                                        delay: start * 6 
                                    }}
                                    style={{ offsetPath: "path('M 50 64 Q 150 0, 250 64 T 450 64 T 650 64 T 850 64 T 1050 64 L 1150 64')" }}
                                />
                            ))}
                        </svg>
                    </div>

                    {steps.map((step, idx) => (
                        <WorkflowCard key={idx} step={step} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};
