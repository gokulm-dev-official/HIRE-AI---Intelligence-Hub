import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Since auth is bypassed on backend, we just simulate success or call real endpoint if it exists
            // const res = await authService.login(formData);
            // localStorage.setItem('token', res.data.token);
            localStorage.setItem('token', 'dummy-token');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication protocol failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9FAFB] font-sans overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-100 rounded-full blur-[100px] opacity-50" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card p-12 w-full max-w-lg shadow-2xl shadow-slate-200 relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                        <ShieldCheck className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Nexus Login
                    </h2>
                    <p className="text-slate-400 mt-3 font-bold text-sm tracking-wide uppercase">AI Intelligence Hub Access</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest flex items-center gap-3"
                    >
                        <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Authorized Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="name@company.ai"
                                className="google-input pl-14 font-bold"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Secure Passkey</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="google-input pl-14 font-bold"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-apple-primary w-full py-5 mt-10 text-lg">
                        Initialize Access <ArrowRight size={20} />
                    </button>

                    <div className="text-center pt-8 border-t border-slate-50 mt-10">
                        <p className="text-slate-400 font-bold text-sm">
                            Need intelligence access? <Link to="/register" className="text-black hover:underline underline-offset-4 decoration-2">Request Credentials</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
