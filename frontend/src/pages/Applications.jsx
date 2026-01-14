import React, { useEffect, useState } from 'react';
import { applicationService } from '../services/api';
import { Sparkles, Building2, MapPin, Calendar, Star, ArrowRight, Loader2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Applications = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await applicationService.getAll();
                setApps(res.data.data);
            } catch (err) {
                console.error('Error fetching apps:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'hired' || s === 'applied') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (s === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-slate-900" size={48} />
                <p className="text-slate-400 font-bold tracking-tight uppercase tracking-widest text-[10px]">Retrieving Global Applications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Application Intelligence</h2>
                    <p className="text-slate-400 font-bold mt-2">Overseeing {apps.length} active recruitment pipelines</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Neural Sync Active</span>
                    </div>
                </div>
            </div>

            {apps.length === 0 ? (
                <div className="apple-card p-24 text-center flex flex-col items-center gap-8">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 shadow-inner">
                        <Briefcase size={36} className="text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Zero Applications Detected</h3>
                        <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">The neural bridge is waiting for its first connection. Start by exploring recommended roles.</p>
                    </div>
                    <button className="btn-apple-primary px-10 h-[64px] rounded-[2rem]" onClick={() => window.location.href = '/jobs'}>
                        Find Jobs
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {apps.map((app, idx) => (
                        <motion.div
                            key={app._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="apple-card !p-8 flex items-center justify-between hover:translate-x-2 transition-all group relative border-l-4 border-l-transparent hover:border-l-black"
                        >
                            <div className="flex items-center gap-10">
                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-black group-hover:border-black transition-all duration-500">
                                    <span className="text-2xl font-black text-slate-400 group-hover:text-white transition-colors">
                                        {(app.job?.company || 'A').charAt(0)}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{app.job?.title || 'Unknown Role'}</h3>
                                        <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(app.status)}`}>
                                            {app.status || 'Active'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                                        <span className="flex items-center gap-2"><Building2 size={16} />{app.job?.company}</span>
                                        <span className="flex items-center gap-2"><MapPin size={16} />{app.job?.district || 'Tamil Nadu'}</span>
                                        <span className="flex items-center gap-2"><Calendar size={16} />Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-16 pr-6">
                                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                    <div className="flex items-center gap-2 justify-center mb-1">
                                        <Star size={14} className="text-black fill-black" />
                                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Match Score</p>
                                    </div>
                                    <span className="text-slate-900 font-black text-3xl tracking-tighter">
                                        {app.matchingScore?.overall || 85}%
                                    </span>
                                </div>

                                <div className="flex flex-col items-end gap-3 text-right">
                                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Candidate linked</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-900 font-bold text-sm">{app.candidate?.firstName} {app.candidate?.lastName}</span>
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[10px]">
                                            {(app.candidate?.firstName || 'C').charAt(0)}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-12 h-12 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white hover:border-black transition-all">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Applications;
