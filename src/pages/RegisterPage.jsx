import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Radio, Monitor } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('viewer');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(username, email, password, role);
            toast.success('Account Created — Welcome to Synapt');
            navigate('/live');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-green-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <Logo className="w-8 h-8" />
                        <span className="text-xl font-bold">Synapt</span>
                    </Link>
                    <h1 className="text-3xl font-bold font-outfit mb-2">Create Account</h1>
                    <p className="text-foreground/50 text-sm">Join the Guardian Network</p>
                </div>

                {/* Form Card */}
                <div className="bg-foreground/[0.03] backdrop-blur-xl border border-foreground/10 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-semibold tracking-wider uppercase text-foreground/40 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <input
                                    id="register-username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="guardian_001"
                                    className="w-full pl-10 pr-4 py-3 bg-foreground/[0.05] border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold tracking-wider uppercase text-foreground/40 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <input
                                    id="register-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="agent@synapt.io"
                                    className="w-full pl-10 pr-4 py-3 bg-foreground/[0.05] border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold tracking-wider uppercase text-foreground/40 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    className="w-full pl-10 pr-12 py-3 bg-foreground/[0.05] border border-foreground/10 rounded-xl text-sm placeholder:text-foreground/20 focus:outline-none focus:border-foreground/30 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-xs font-semibold tracking-wider uppercase text-foreground/40 mb-3">Select Role</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole('viewer')}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                                        role === 'viewer'
                                            ? 'border-foreground/40 bg-foreground/10'
                                            : 'border-foreground/10 bg-foreground/[0.03] hover:border-foreground/20'
                                    }`}
                                >
                                    <Monitor className={`w-5 h-5 ${role === 'viewer' ? 'text-foreground' : 'text-foreground/30'}`} />
                                    <div className="text-left">
                                        <div className={`text-sm font-semibold ${role === 'viewer' ? 'text-foreground' : 'text-foreground/50'}`}>Viewer</div>
                                        <div className="text-[10px] text-foreground/30">Watch & Chat</div>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('streamer')}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                                        role === 'streamer'
                                            ? 'border-red-500/40 bg-red-500/10'
                                            : 'border-foreground/10 bg-foreground/[0.03] hover:border-foreground/20'
                                    }`}
                                >
                                    <Radio className={`w-5 h-5 ${role === 'streamer' ? 'text-red-500' : 'text-foreground/30'}`} />
                                    <div className="text-left">
                                        <div className={`text-sm font-semibold ${role === 'streamer' ? 'text-red-400' : 'text-foreground/50'}`}>Streamer</div>
                                        <div className="text-[10px] text-foreground/30">Go Live</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-3 bg-foreground text-background font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <>
                                    Initialize Account <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-foreground/30 text-sm mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-foreground/70 hover:text-foreground font-medium transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
