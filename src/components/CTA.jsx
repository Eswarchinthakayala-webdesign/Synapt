import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CTA = () => {
    return (
        <section className="py-20 sm:py-28 md:py-32 lg:py-40 relative overflow-hidden bg-background">
            <div className="absolute inset-0 bg-foreground/[0.03] blur-[100px] sm:blur-[150px] rounded-full -top-1/2 left-1/2 -translate-x-1/2 w-full h-full -z-10"></div>
            
            <div className="container mx-auto px-4 sm:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto mb-6 sm:mb-8 md:mb-10 border border-foreground/10 backdrop-blur-md">
                        <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-foreground" />
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 md:mb-10 leading-[0.9] sm:leading-[0.85] italic tracking-tighter px-2">
                        Protect Your Link <br />
                        <span className="text-foreground/10 not-italic font-black">Guardian Shield.</span>
                    </h2>
                    
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/40 mb-10 sm:mb-12 md:mb-16 max-w-xs sm:max-w-md md:max-w-2xl mx-auto font-light leading-relaxed tracking-tight px-2">
                        Join the next generation of content creators using Synapt to eliminate spam, bots, and toxicity in real-time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                        <Link to="/live" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-14 sm:h-16 md:h-18 lg:h-20 px-10 sm:px-12 md:px-16 text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.4em] uppercase bg-foreground text-background hover:scale-105 active:scale-95 transition-all rounded-[22px] sm:rounded-[28px] md:rounded-[32px] shadow-2xl overflow-hidden group">
                                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                    Initialize Link
                                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </Button>
                        </Link>
                    </div>
                    
                    <p className="mt-8 sm:mt-10 md:mt-12 text-foreground/20 text-[10px] sm:text-xs md:text-sm font-medium tracking-wide uppercase">
                        Scale to millions. Moderate in milliseconds.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
