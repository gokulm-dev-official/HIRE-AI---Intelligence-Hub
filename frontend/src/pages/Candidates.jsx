import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService } from '../services/api';
import { Loader2, Search, Filter, MoreVertical, Trash2, Eye, Edit3, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Candidates = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [editingCandidate, setEditingCandidate] = useState(null);
    const { data: candidatesRes, isLoading } = useQuery({
        queryKey: ['candidates'],
        queryFn: candidateService.getAll
    });

    const deleteMutation = useMutation({
        mutationFn: candidateService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
        onError: (err) => {
            alert('Critial Failure: Could not remove intelligence node. ' + (err.response?.data?.message || err.message));
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => candidateService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            setEditingCandidate(null);
            alert('Candidate profile updated successfully!');
        },
        onError: (err) => {
            alert('Update failed: ' + (err.response?.data?.message || err.message));
        }
    });

    const candidates = candidatesRes?.data?.data || [];

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this candidate from the intelligence pool?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            status: formData.get('status'),
            totalYearsOfExperience: Number(formData.get('experience'))
        };
        updateMutation.mutate({ id: editingCandidate._id, data });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-slate-900" size={48} />
                <p className="text-slate-400 font-black tracking-tight">Syncing Intelligence Matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 relative">
            {/* Edit Modal */}
            <AnimatePresence>
                {editingCandidate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingCandidate(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setEditingCandidate(null)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10 flex items-center gap-4">
                                <Edit3 className="text-black" size={32} /> Edit Profile
                            </h3>

                            <form onSubmit={handleUpdateSubmit} className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Given Name</label>
                                    <input name="firstName" defaultValue={editingCandidate.firstName} className="google-input font-bold" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Family Name</label>
                                    <input name="lastName" defaultValue={editingCandidate.lastName} className="google-input font-bold" required />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Communication Endpoint</label>
                                    <input name="email" defaultValue={editingCandidate.email} className="google-input font-bold" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Seniority (Years)</label>
                                    <input name="experience" type="number" defaultValue={editingCandidate.totalYearsOfExperience} className="google-input font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Intelligence Status</label>
                                    <select name="status" defaultValue={editingCandidate.status} className="google-input font-bold appearance-none bg-slate-50 cursor-pointer">
                                        <option value="New">New Ingestion</option>
                                        <option value="Screening">Active Screening</option>
                                        <option value="Verified">AI Verified</option>
                                        <option value="Shortlisted">Premium Match</option>
                                        <option value="Rejected">Non-Compliant</option>
                                    </select>
                                </div>

                                <div className="col-span-2 flex gap-4 mt-8">
                                    <button
                                        type="submit"
                                        disabled={updateMutation.isPending}
                                        className="btn-apple-primary flex-1 py-5"
                                    >
                                        {updateMutation.isPending ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                                        Override Metadata
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-100/50">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Talent Pool</h2>
                    <p className="text-slate-400 text-sm font-bold mt-1">Manage ingested candidate intelligence</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter candidates..."
                            className="bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 text-slate-900 focus:bg-white focus:border-black outline-none text-sm transition-all w-72 font-bold placeholder:text-slate-300 shadow-sm"
                        />
                    </div>
                    <button className="bg-white hover:bg-slate-50 border border-slate-100 p-3.5 rounded-2xl text-slate-600 transition-all shadow-sm active:scale-95">
                        <Filter size={18} />
                    </button>
                    <button onClick={() => navigate('/upload')} className="btn-apple-primary px-8">
                        Ingest New
                    </button>
                </div>
            </div>

            <div className="apple-card !mt-0 !p-2 overflow-hidden border-none shadow-2xl shadow-slate-200/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead>
                            <tr className="bg-slate-50 group">
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400 rounded-tl-[1.5rem]">Name & Contact</th>
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Core Skills</th>
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Exp.</th>
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Location</th>
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">AI Status</th>
                                <th className="px-8 py-5 font-black uppercase tracking-[0.15em] text-[10px] text-slate-400 text-right rounded-tr-[1.5rem]">Registry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {candidates.map((c, idx) => (
                                    <motion.tr
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-black/10 group-hover:scale-105 transition-transform duration-300">
                                                    {c.firstName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-slate-900 font-black text-[15px] tracking-tight">{c.firstName} {c.lastName}</div>
                                                    <div className="text-slate-400 text-xs font-bold mt-0.5">{c.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-1.5 flex-wrap max-w-xs">
                                                {c.skills?.slice(0, 3).map((s, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 shadow-sm uppercase tracking-wider">
                                                        {s.name}
                                                    </span>
                                                ))}
                                                {c.skills?.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400">
                                                        +{c.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-900 font-black text-sm">
                                            {c.totalYearsOfExperience || 0}Y
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                            {c.location?.city || 'Remote'}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-500/5`}>
                                                {c.status || 'Verified'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                                                <button onClick={() => navigate(`/candidates/${c._id}`)} className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-black transition-colors shadow-sm">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => setEditingCandidate(c)} className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-black transition-colors shadow-sm">
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c._id)}
                                                    className="p-2.5 bg-white hover:bg-rose-50 border border-slate-100 hover:border-rose-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {candidates.length === 0 && !isLoading && (
                        <div className="py-32 text-center bg-slate-50/30">
                            <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-100">
                                <Search className="text-slate-200" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Matrix is Empty</h3>
                            <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">The talent database is waiting for new intelligence. Start by ingesting a resume.</p>
                            <button className="btn-apple-primary px-10 mt-10 mx-auto">
                                Ingest Resume
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Candidates;
