import React, { useState, useEffect, useCallback } from 'react';
import { ModeToggle } from './mode-toogle';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Radio, Menu, X, ChevronRight, Shield } from 'lucide-react';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const handleLogout = useCallback(() => {
        logout();
        navigate('/');
        setMobileOpen(false);
    }, [logout, navigate]);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Live Stream', path: '/live' },
        ...(user?.role === 'streamer' ? [{ name: 'Dashboard', path: '/dashboard' }] : [])
    ];

    const isActive = (path) => location.pathname === path;

    // Mobile menu animation variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const drawerVariants = {
        hidden: { x: '100%', opacity: 0.5 },
        visible: { 
            x: 0, 
            opacity: 1,
            transition: { type: 'spring', damping: 30, stiffness: 300 }
        },
        exit: { 
            x: '100%', 
            opacity: 0,
            transition: { duration: 0.25, ease: 'easeIn' }
        }
    };

    const staggerChildren = {
        visible: {
            transition: { staggerChildren: 0.06, delayChildren: 0.15 }
        }
    };

    const menuItemVariants = {
        hidden: { opacity: 0, x: 40 },
        visible: { 
            opacity: 1, 
            x: 0, 
            transition: { type: 'spring', damping: 25, stiffness: 200 } 
        }
    };

    return (
        <>
            <nav 
                className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
                    scrolled 
                        ? 'bg-background/70 backdrop-blur-2xl border-b border-foreground/[0.06] py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.08)]' 
                        : 'bg-transparent py-4 md:py-5'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0 relative z-10">
                        <div className="relative">
                            <Logo className="w-8 h-8 md:w-9 md:h-9 group-hover:scale-110 transition-transform duration-500 ease-out" />
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-0 group-hover:scale-[2] transition-transform duration-700"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-bold tracking-tighter leading-none">Synapt</span>
                            <span className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-foreground/30 uppercase mt-0.5">Neural OS</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Center Pills */}
                    <div className="hidden lg:flex items-center gap-1 bg-foreground/[0.03] backdrop-blur-md rounded-2xl p-1 border border-foreground/[0.06]">
                        {navItems.map((item) => (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className={`relative px-5 xl:px-6 py-2.5 text-[10px] font-black tracking-[0.18em] uppercase rounded-xl transition-all duration-300 ${
                                    isActive(item.path) 
                                        ? 'text-foreground bg-foreground/[0.07]' 
                                        : 'text-foreground/40 hover:text-foreground hover:bg-foreground/[0.04]'
                                }`}
                            >
                                {item.name}
                                {isActive(item.path) && (
                                    <motion.div 
                                        layoutId="nav-indicator"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-foreground/40 rounded-full"
                                        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <ModeToggle />
                        
                        {/* Desktop Auth */}
                        <div className="hidden lg:flex items-center gap-2.5">
                            {isAuthenticated ? (
                                <>
                                    {/* User Pill */}
                                    <div className="flex items-center gap-2.5 px-3.5 py-2 bg-foreground/[0.04] rounded-xl border border-foreground/[0.08] hover:border-foreground/15 transition-colors">
                                        <div className="relative">
                                            <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center text-[10px] font-black uppercase">
                                                {user?.username?.charAt(0) || 'U'}
                                            </div>
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                                                user?.role === 'streamer' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                                            }`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-foreground/80 leading-none">{user?.username}</span>
                                            <span className="text-[9px] font-medium text-foreground/30 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                                {user?.role === 'streamer' && <Radio className="w-2.5 h-2.5 text-red-400" />}
                                                {user?.role || 'viewer'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2.5 rounded-xl hover:bg-foreground/[0.06] text-foreground/30 hover:text-foreground transition-all duration-300"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2.5 text-[10px] font-black tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-5 py-2.5 bg-foreground text-background text-[10px] font-black tracking-[0.15em] uppercase rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-foreground/10"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden relative z-[60] p-2 rounded-xl hover:bg-foreground/[0.06] transition-colors"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {mobileOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            variants={backdropVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden fixed inset-0 z-[55] bg-background/60 backdrop-blur-sm"
                        />
                        
                        {/* Drawer */}
                        <motion.div
                            variants={drawerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="lg:hidden fixed top-0 right-0 z-[58] w-[85%] max-w-sm h-full bg-background/95 backdrop-blur-3xl border-l border-foreground/[0.06] shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-6 pt-5 border-b border-foreground/[0.06]">
                                <div className="flex items-center gap-2.5">
                                    <Shield className="w-4 h-4 text-foreground/30" />
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-foreground/30">Navigation</span>
                                </div>
                            </div>

                            {/* Nav Links */}
                            <motion.div 
                                variants={staggerChildren}
                                initial="hidden"
                                animate="visible"
                                className="flex-1 overflow-y-auto py-4 px-4"
                            >
                                {navItems.map((item) => (
                                    <motion.div key={item.name} variants={menuItemVariants}>
                                        <Link 
                                            to={item.path} 
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center justify-between px-5 py-4 rounded-2xl mb-1.5 transition-all duration-300 group ${
                                                isActive(item.path) 
                                                    ? 'bg-foreground/[0.07] text-foreground' 
                                                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {isActive(item.path) && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
                                                )}
                                                <span className="text-sm font-bold tracking-wide">{item.name}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 transition-all duration-300 ${
                                                isActive(item.path) ? 'opacity-60' : 'opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0'
                                            }`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Drawer Footer - Auth */}
                            <div className="p-5 border-t border-foreground/[0.06] space-y-3">
                                {isAuthenticated ? (
                                    <>
                                        {/* User Info */}
                                        <div className="flex items-center gap-3 px-4 py-3 bg-foreground/[0.04] rounded-2xl border border-foreground/[0.06]">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center text-sm font-black uppercase">
                                                    {user?.username?.charAt(0) || 'U'}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                                                    user?.role === 'streamer' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                                                }`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-semibold leading-none">{user?.username}</div>
                                                <div className="text-[10px] text-foreground/40 uppercase tracking-wider mt-1 flex items-center gap-1">
                                                    {user?.role === 'streamer' && <Radio className="w-2.5 h-2.5 text-red-400" />}
                                                    {user?.role || 'viewer'}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl border border-foreground/[0.08] text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04] transition-all text-xs font-bold tracking-wider uppercase"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2.5">
                                        <Link
                                            to="/login"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center px-5 py-3.5 rounded-2xl border border-foreground/[0.08] text-foreground/60 hover:text-foreground hover:bg-foreground/[0.04] transition-all text-xs font-bold tracking-wider uppercase"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setMobileOpen(false)}
                                            className="w-full text-center px-5 py-3.5 rounded-2xl bg-foreground text-background text-xs font-bold tracking-wider uppercase shadow-lg shadow-foreground/10 hover:opacity-90 transition-all"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
