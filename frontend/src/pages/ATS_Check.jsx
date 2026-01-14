import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService } from '../services/api';
import {
    FileText, Upload, Loader2, CheckCircle, AlertCircle,
    TrendingUp, Award, Target, Zap, ArrowRight, RefreshCw,
    User, Mail, Phone, MapPin, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ATS_Check = () => {
    const queryClient = useQueryClient();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    // Fetch all candidates
    const { data: candidatesRes, isLoading } = useQuery({
        queryKey: ['candidates'],
        queryFn: candidateService.getAll
    });

    const candidates = candidatesRes?.data?.data || [];

    // File upload mutation
    const uploadMutation = useMutation({
        mutationFn: (file) => {
            const formData = new FormData();
            formData.append('resume', file);
            return candidateService.upload(formData);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(['candidates']);
            setSelectedCandidate(data.data.data);
        },
        onError: (err) => {
            alert('Upload failed: ' + (err.response?.data?.message || err.message));
        }
    });

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadMutation.mutate(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) uploadMutation.mutate(file);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-rose-500';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-rose-500';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Needs Improvement';
        return 'Poor';
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">ATS Resume Analyzer</h1>
                    <p className="text-slate-400 font-bold mt-2">Upload or select a resume to get detailed ATS scoring and improvement recommendations</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">AI Engine Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Upload + Candidate List */}
                <div className="space-y-8">
                    {/* Upload Zone */}
                    <div
                        className={`apple-card !p-0 overflow-hidden transition-all ${dragActive ? 'ring-2 ring-black' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                    >
                        <label className="cursor-pointer block p-12 text-center hover:bg-slate-50 transition-colors">
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                            {uploadMutation.isPending ? (
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-black" size={48} />
                                    <p className="text-slate-400 font-bold">Analyzing resume...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100">
                                        <Upload size={32} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 font-black text-lg">Drop resume here</p>
                                        <p className="text-slate-400 font-bold text-sm mt-1">or click to upload (PDF, DOC, DOCX)</p>
                                    </div>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Candidate List */}
                    <div className="apple-card !p-0">
                        <div className="p-6 border-b border-slate-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Select Existing Resume</h3>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="animate-spin text-slate-400 mx-auto" size={32} />
                                </div>
                            ) : candidates.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 font-bold">
                                    No resumes uploaded yet
                                </div>
                            ) : (
                                candidates.map(c => (
                                    <button
                                        key={c._id}
                                        onClick={() => setSelectedCandidate(c)}
                                        className={`w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left ${selectedCandidate?._id === c._id ? 'bg-slate-50' : ''}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white ${selectedCandidate?._id === c._id ? 'bg-black' : 'bg-slate-200 text-slate-500'}`}>
                                            {c.firstName?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate">{c.firstName} {c.lastName}</p>
                                            <p className="text-xs text-slate-400 truncate">{c.email}</p>
                                        </div>
                                        <div className={`text-lg font-black ${getScoreColor(c.atsScore || 0)}`}>
                                            {c.atsScore || 0}%
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Analysis Results */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {!selectedCandidate ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="apple-card p-20 text-center flex flex-col items-center gap-6"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100">
                                    <FileText size={40} className="text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Resume Selected</h3>
                                    <p className="text-slate-400 font-bold mt-2">Upload a new resume or select one from the list to see ATS analysis</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={selectedCandidate._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Score Card */}
                                <div className="apple-card bg-slate-900 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h2 className="text-2xl font-black tracking-tight">{selectedCandidate.firstName} {selectedCandidate.lastName}</h2>
                                                <p className="text-slate-400 font-bold mt-1">{selectedCandidate.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-6xl font-black ${getScoreColor(selectedCandidate.atsScore || 0)}`}>
                                                    {selectedCandidate.atsScore || 0}
                                                </div>
                                                <div className="text-slate-400 text-sm font-black uppercase tracking-widest mt-1">ATS Score</div>
                                            </div>
                                        </div>

                                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${selectedCandidate.atsScore || 0}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${getScoreBg(selectedCandidate.atsScore || 0)}`}
                                            />
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span className={`font-black ${getScoreColor(selectedCandidate.atsScore || 0)}`}>
                                                {getScoreLabel(selectedCandidate.atsScore || 0)}
                                            </span>
                                            <span className="text-slate-500">Target: 80%+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { icon: Briefcase, label: 'Experience', value: `${selectedCandidate.totalYearsOfExperience || 0}+ years` },
                                        { icon: Target, label: 'Skills', value: `${selectedCandidate.skills?.length || 0} listed` },
                                        { icon: Mail, label: 'Contact', value: selectedCandidate.email ? 'Present' : 'Missing' },
                                        { icon: FileText, label: 'Resume', value: selectedCandidate.resume?.filename?.slice(0, 15) || 'Uploaded' }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="apple-card !p-4 text-center">
                                            <stat.icon size={20} className="mx-auto text-slate-400 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                            <p className="text-slate-900 font-bold text-sm mt-1 truncate">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recommendations */}
                                <div className="apple-card">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Zap className="text-yellow-500" size={24} />
                                        <h3 className="text-lg font-black text-slate-900">Improvement Recommendations</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {(selectedCandidate.atsFeedback && selectedCandidate.atsFeedback.length > 0) ? (
                                            selectedCandidate.atsFeedback.map((feedback, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-slate-200 transition-all"
                                                >
                                                    <div className="mt-0.5">
                                                        {feedback.toLowerCase().includes('missing') || feedback.toLowerCase().includes('low') || feedback.toLowerCase().includes('short') ? (
                                                            <AlertCircle size={20} className="text-rose-500" />
                                                        ) : (
                                                            <CheckCircle size={20} className="text-emerald-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-slate-700 font-medium leading-relaxed">{feedback}</p>
                                                    </div>
                                                    <ArrowRight size={20} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1 transition-all" />
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-slate-400 font-bold">
                                                <CheckCircle size={40} className="mx-auto text-emerald-500 mb-4" />
                                                <p>This resume is well-optimized for ATS systems!</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Skills Analysis */}
                                {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                                    <div className="apple-card">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Detected Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 hover:bg-black hover:text-white hover:border-black transition-all cursor-default"
                                                >
                                                    {skill.name || skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ATS_Check;
