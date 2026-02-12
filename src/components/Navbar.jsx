import React, { useState, useEffect } from 'react';
import { ModeToggle } from './mode-toogle';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-background/60 backdrop-blur-xl border-b border-foreground/5 py-3' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between gap-8">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
                    <div className="relative">
                        <Logo className="w-9 h-9 group-hover:scale-110 transition-transform duration-500 ease-out" />
                        <div className="absolute inset-0 bg-foreground/10 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tighter leading-none">Synapt</span>
                        <span className="text-[9px] font-bold tracking-[0.2em] text-foreground/30 uppercase mt-1">Neutral OS</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-2 bg-foreground/[0.03] backdrop-blur-md rounded-2xl p-1.5 border border-foreground/5 translate-x-12">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Live Stream', path: '/live' }
                    ].map((item) => (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className="px-6 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground hover:bg-foreground/[0.05] rounded-xl transition-all duration-300"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};
