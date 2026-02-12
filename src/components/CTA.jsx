import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
    return (
        <section className="py-40 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-foreground/[0.03] blur-[150px] rounded-full -top-1/2 left-1/2 -translate-x-1/2 w-full h-full -z-10"></div>
            
            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto mb-10 border border-foreground/10 backdrop-blur-md">
                        <Shield className="w-10 h-10 text-foreground" />
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-[0.85] italic tracking-tighter">
                        Protect Your Link <br />
                        <span className="text-foreground/10 not-italic font-black">Guardian Shield.</span>
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-foreground/40 mb-16 max-w-2xl mx-auto font-light leading-relaxed tracking-tight">
                        Join the next generation of content creators using Synapt to eliminate spam, bots, and toxicity in real-time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/live">
                            <Button size="lg" className="h-20 px-16 text-[10px] font-black tracking-[0.4em] uppercase bg-foreground text-background hover:scale-105 active:scale-95 transition-all rounded-[32px] shadow-2xl overflow-hidden group">
                                <span className="relative z-10">Initialize Link</span>
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </Button>
                        </Link>
                    </div>
                    
                    <p className="mt-12 text-foreground/20 text-sm font-medium tracking-wide uppercase">
                        Scale to millions. Modrate in milliseconds.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
