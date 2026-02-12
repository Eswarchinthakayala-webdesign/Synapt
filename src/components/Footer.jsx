import React from 'react';
import { Logo } from './Logo';
import { Twitter, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer = () => {
    return (
        <footer className="py-32 border-t border-foreground/5 bg-background noise-bg">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <Logo className="w-10 h-10" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tighter leading-none">Synapt</span>
                                <span className="text-[9px] font-bold tracking-[0.3em] text-foreground/30 uppercase mt-1 italic">Guardian Systems Inc.</span>
                            </div>
                        </div>
                        <p className="text-foreground/40 text-lg max-w-sm leading-relaxed font-light tracking-tight">
                            Advancing autonomous moderation and real-time suppression for the global link.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-14 h-14 rounded-2xl glass border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-500 group shadow-lg">
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-foreground/30 italic">Platform</h4>
                            <ul className="space-y-5 text-sm font-medium text-foreground/50">
                                {['Moderation Core', 'Analytics', 'Live Shield', 'Security'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-foreground transition-all flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item}
                                    </a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-foreground/30 italic">Company</h4>
                            <ul className="space-y-5 text-sm font-medium text-foreground/50">
                                {['Philosophy', 'Research', 'Careers', 'Changelog'].map(item => (
                                    <li key={item}><a href="#" className="hover:text-foreground transition-all flex items-center gap-2 group">
                                        <div className="w-1 h-1 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {item}
                                    </a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-10 col-span-2 md:col-span-1">
                            <h4 className="font-bold text-[10px] uppercase tracking-[0.4em] text-foreground/30 italic">Updates</h4>
                            <div className="space-y-4">
                                <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-widest leading-relaxed">Join the waitlist for <br />Synapt Kernel Beta</p>
                                <div className="flex items-center glass rounded-2xl p-1 shrink-0 border border-foreground/10 group focus-within:ring-1 ring-foreground/30 transition-all">
                                    <input 
                                        type="email" 
                                        placeholder="email@access.id" 
                                        className="bg-transparent border-none outline-none text-xs text-foreground/80 placeholder:text-foreground/20 px-4 w-full font-mono"
                                    />
                                    <button className="w-10 h-10 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-90 transition-opacity">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8 text-foreground/20 text-[10px] font-bold uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-6">
                        <p>© 2026 Synapt AI Inc.</p>
                        <div className="w-1 h-1 rounded-full bg-foreground/10"></div>
                        <p className="italic">San Francisco, CA</p>
                    </div>
                    <div className="flex gap-12">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy Protocol</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms of Sync</a>
                        <a href="#" className="hover:text-foreground transition-colors">System Status</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
