import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { Building2, Mail, Lock, User, ArrowRight, Database } from 'lucide-react';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        orgName: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Since auth is bypassed on backend, we just simulate success
            // const res = await authService.register(formData);
            // localStorage.setItem('token', res.data.token);
            localStorage.setItem('token', 'dummy-token');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Nexus registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9FAFB] font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-slate-100 rounded-full blur-[120px] opacity-40" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-40" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="apple-card p-12 w-full max-w-2xl shadow-2xl shadow-slate-200 relative z-10"
            >
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/10">
                        <Database className="text-white" size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                        Nexus Registration
                    </h2>
                    <p className="text-slate-400 mt-3 font-bold text-sm tracking-wide uppercase">Initialize your recruitment ecosystem</p>
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
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Organization Identity</label>
                        <div className="relative group">
                            <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Enterprise Name"
                                className="google-input pl-14 font-bold"
                                value={formData.orgName}
                                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Lead Admin</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="google-input pl-14 font-bold"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2 pt-6">
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="google-input font-bold"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Nexus Endpoint (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="admin@enterprise.ai"
                                className="google-input pl-14 font-bold"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Security Protocol (Password)</label>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Initialize Passkey"
                                className="google-input pl-14 font-bold"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-apple-primary w-full py-5 mt-10 text-lg shadow-2xl shadow-black/20">
                        Deploy Ecosystem <ArrowRight size={22} />
                    </button>

                    <div className="text-center pt-10 border-t border-slate-50 mt-10">
                        <p className="text-slate-400 font-bold text-sm">
                            Already part of the network? <Link to="/login" className="text-black hover:underline underline-offset-4 decoration-2">Direct Sign In</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
