import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { candidateService } from '../services/api';
import {
    Loader2, ArrowLeft, Mail, Phone, MapPin,
    Linkedin, Github, Globe, Briefcase, GraduationCap,
    Award, ChevronRight, User, FileText, Sparkles, CheckCircle, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const CandidateView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: candidateRes, isLoading } = useQuery({
        queryKey: ['candidate', id],
        queryFn: () => candidateService.getById(id)
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-slate-900" size={48} />
                <p className="text-slate-400 font-black tracking-tight uppercase tracking-[0.2em] text-xs">Accessing Profile Registry...</p>
            </div>
        );
    }

    const c = candidateRes?.data?.data;

    if (!c) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <FileText className="text-slate-200" size={64} />
                <p className="text-slate-400 font-black tracking-tight">Intelligence profile not found.</p>
                <button onClick={() => navigate('/candidates')} className="btn-apple-secondary">Return to Pool</button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            {/* Navigation Header */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate('/candidates')}
                    className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-black hover:border-black transition-all shadow-sm group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Profile Registry / </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">#{c._id.slice(-6)}</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Candidate Blueprint</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Personal Info & Contact */}
                <div className="space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="apple-card !p-10 text-center"
                    >
                        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 mx-auto mb-8 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-black/20">
                            {c.firstName.charAt(0)}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{c.firstName} {c.lastName}</h1>
                        <p className="text-slate-500 font-bold mb-8">{c.headline || 'Senior Software Professional'}</p>

                        <div className="space-y-4 text-left border-t border-slate-50 pt-8">
                            <div className="flex items-center gap-4 text-slate-600">
                                <Mail size={18} className="text-slate-300" />
                                <span className="text-sm font-bold">{c.email}</span>
                            </div>
                            {c.phone && (
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Phone size={18} className="text-slate-300" />
                                    <span className="text-sm font-bold">{c.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-4 text-slate-600">
                                <MapPin size={18} className="text-slate-300" />
                                <span className="text-sm font-bold">{c.location?.city}, {c.location?.country}</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-10">
                            {c.socialProfiles?.linkedin && (
                                <a href={c.socialProfiles.linkedin} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-[#0077b5] transition-colors">
                                    <Linkedin size={20} />
                                </a>
                            )}
                            {c.socialProfiles?.github && (
                                <a href={c.socialProfiles.github} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-black transition-colors">
                                    <Github size={20} />
                                </a>
                            )}
                            {c.socialProfiles?.portfolio && (
                                <a href={c.socialProfiles.portfolio} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-500 transition-colors">
                                    <Globe size={20} />
                                </a>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="apple-card"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-3">
                            <Award size={18} /> Core Intelligence
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                            {c.skills.map((skill, idx) => (
                                <div key={idx} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-700 uppercase tracking-wider">
                                    {skill.name}
                                    <span className="ml-2 text-slate-300">• {skill.level}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Experience & Education */}
                <div className="lg:col-span-2 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="apple-card bg-slate-900 text-white overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />

                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-3 mb-2">
                                    <Sparkles size={18} /> ATS Diagnostic Center
                                </h3>
                                <p className="text-slate-400 text-xs font-bold">Enterprise-Grade Performance Audit</p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-black tracking-tighter text-white mb-1">
                                    {c.atsScore || 0}<span className="text-xl text-slate-500">/100</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${c.atsScore > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    {c.atsScore > 80 ? 'Optimized' : 'Needs Action'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                                    <span>Core Structural Strength</span>
                                    <span>{c.atsScore}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${c.atsScore || 0}%` }}
                                        className={`h-full rounded-full ${c.atsScore > 80 ? 'bg-emerald-400' : c.atsScore > 60 ? 'bg-yellow-400' : 'bg-rose-400'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-slate-800 pb-2">Diagnostic Feedback</h4>
                                <div className="space-y-4">
                                    {(c.atsFeedback && c.atsFeedback.length > 0 ? c.atsFeedback : ["Resume core satisfies primary ATS requirements."]).map((f, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-800 group hover:bg-slate-800 transition-colors">
                                            <div className="mt-1">
                                                {f.toLowerCase().includes('missing') || f.toLowerCase().includes('low') || f.toLowerCase().includes('short') ? (
                                                    <AlertCircle size={16} className="text-rose-400" />
                                                ) : (
                                                    <CheckCircle size={16} className="text-emerald-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                                                {f}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="apple-card"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-3 border-b border-slate-50 pb-6">
                            <User size={18} /> Executive Summary
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-medium text-lg italic">
                            "{c.summary || 'No summary provided in record.'}"
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="apple-card"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-3">
                            <Briefcase size={18} /> Experience History
                        </h3>
                        <div className="space-y-12">
                            {c.experience.map((exp, idx) => (
                                <div key={idx} className="relative pl-10 border-l-2 border-slate-50 pb-4 last:border-0 last:pb-0">
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm" />
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{exp.title}</h4>
                                        <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <p className="text-slate-900 font-bold text-sm mb-4">{exp.company}</p>
                                    <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="apple-card"
                    >
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 flex items-center gap-3">
                            <GraduationCap size={18} /> Academic Background
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {c.education.map((edu, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                                    <h4 className="text-lg font-black text-slate-900 mb-1">{edu.degree} in {edu.field}</h4>
                                    <p className="text-slate-500 font-bold text-sm">{edu.institution}</p>
                                    {edu.gpa && (
                                        <div className="mt-4 inline-flex items-center px-3 py-1 bg-white rounded-xl border border-slate-100 text-xs font-black">
                                            GPA: {edu.gpa}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CandidateView;
