import React from 'react';
import { Logo } from './Logo';

export const Footer = () => {
    return (
        <footer className="w-full border-t border-foreground/[0.06] bg-background/80 backdrop-blur-md noise-bg">
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                {/* Brand */}
                <div className="flex items-center gap-2.5 group">
                    <Logo className="w-6 h-6 sm:w-7 sm:h-7" />
                    <div className="flex flex-col">
                        <span className="text-sm sm:text-base font-bold tracking-tighter leading-none">Synapt</span>

                    </div>
                </div>

                {/* Copyright */}
                <p className="text-foreground/25 text-[9px] sm:text-[10px] font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                    © {new Date().getFullYear()} Synapt AI Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};
