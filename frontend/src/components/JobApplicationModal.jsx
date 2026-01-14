import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, FileText, Sparkles, Building2, MapPin, Calendar, Clock, ShieldCheck } from 'lucide-react';

const JobApplicationModal = ({ isOpen, onClose, job, candidate, onConfirm, isPending }) => {
    if (!job || !candidate) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
                                    <Building2 className="text-white" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Review Application</h2>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{job.title}</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                            {/* Candidate Info */}
                            <div className="apple-card !bg-slate-50 border-none">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <FileText className="text-black" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Applying as</p>
                                        <p className="text-lg font-black text-slate-900">{candidate.firstName} {candidate.lastName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Email</p>
                                        <p className="text-xs font-bold text-slate-600 truncate">{candidate.email}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-2xl">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Match Score</p>
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-emerald-500" />
                                            <p className="text-xs font-black text-emerald-600 uppercase">{job.matchScore || 85}% Optimized</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Features */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 px-2">Intelligence Verification</h3>
                                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-black/5 transition-colors">
                                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center shrink-0">
                                        <ShieldCheck className="text-slate-900" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Resume Data Synced</p>
                                        <p className="text-slate-400 text-xs">Your latest AI-parsed skills and experience are automatically included.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:border-black/5 transition-colors">
                                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="text-slate-900" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">Priority Queue</p>
                                        <p className="text-slate-400 text-xs">High-match candidates are highlighted in the employer's dashboard.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 btn-apple-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => onConfirm(job._id || job.id)}
                                disabled={isPending}
                                className="flex-[2] btn-apple-primary gap-3 py-4"
                            >
                                {isPending ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Encrypting & Sending...
                                    </>
                                ) : (
                                    <>
                                        Confirm Application
                                        <CheckCircle2 size={20} />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JobApplicationModal;
