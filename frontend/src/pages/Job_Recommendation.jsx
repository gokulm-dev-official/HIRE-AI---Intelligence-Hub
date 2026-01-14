import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobService, candidateService, applicationService } from '../services/api';
import { Search, MapPin, Building2, Calendar, ArrowRight, Star, Sparkles, Loader2, ExternalLink, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import JobApplicationModal from '../components/JobApplicationModal';

const Job_Recommendation = () => {
    const [district, setDistrict] = useState('All Districts');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const districts = ['All Districts', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'];

    // 1. Fetch Candidates to pick one for applying (Simulation)
    const { data: candidatesRes } = useQuery({
        queryKey: ['candidates'],
        queryFn: candidateService.getAll
    });
    const candidates = candidatesRes?.data?.data || [];
    const defaultCandidate = candidates[0];

    // 2. Fetch Jobs based on district
    const { data: jobsRes, isLoading, refetch } = useQuery({
        queryKey: ['suggestedJobs', district],
        queryFn: () => jobService.getSuggested(district === 'All Districts' ? '' : district)
    });

    const jobs = jobsRes?.data?.data || [];

    // 3. Application Mutation
    const applyMutation = useMutation({
        mutationFn: (jobId) => {
            if (!defaultCandidate) throw new Error('No candidate found to apply with');
            return applicationService.apply({
                jobId,
                candidateId: defaultCandidate._id
            });
        },
        onSuccess: () => {
            setIsModalOpen(false);
            alert('Application submitted successfully via Neural Link! 🚀');
        },
        onError: (err) => {
            alert('Application failed: ' + (err.response?.data?.message || err.message));
        }
    });

    const handleApply = (job) => {
        if (!defaultCandidate) {
            alert('Please ingest a resume first to apply for jobs!');
            return;
        }
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const confirmApply = (jobId) => {
        applyMutation.mutate(jobId);
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Search and Filter Section */}
            <div className="flex gap-6 items-center">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" size={22} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search roles, skills, or companies..."
                        className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 text-slate-900 shadow-xl shadow-slate-100 focus:border-black outline-none text-md font-bold transition-all placeholder:text-slate-300"
                    />
                </div>
                <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="appearance-none bg-white border border-slate-100 rounded-[1.5rem] py-5 pl-12 pr-12 text-slate-900 font-black text-sm focus:border-black outline-none shadow-xl shadow-slate-100 cursor-pointer min-w-[180px]"
                    >
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <button onClick={() => refetch()} className="btn-apple-primary px-10 h-[64px] rounded-[2rem]">
                    Search Intelligence
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-black" size={20} />
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-[10px]">Neural Match Recommendations</h2>
                    </div>
                    {defaultCandidate && (
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            Matching for <span className="text-black">{defaultCandidate.firstName} {defaultCandidate.lastName}</span>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-20 flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-slate-900" size={40} />
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Scanning Global Job Markets...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="apple-card p-24 text-center flex flex-col items-center gap-8 mx-auto max-w-2xl mt-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 shadow-inner">
                            <Briefcase size={32} className="text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Gap Detected</h3>
                            <p className="text-slate-400 font-bold mt-2 text-sm">No job opportunities found in {district}. Try another district or trigger a fresh neural scan.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setDistrict('All Districts')} className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black hover:border-black transition-all">Reset Filter</button>
                            <button onClick={() => refetch()} className="px-6 py-3 bg-black rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:scale-105 transition-all">Neural Scan</button>
                        </div>
                    </div>
                ) : (
                    jobs.map((job, idx) => (
                        <motion.div
                            key={job._id || job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="apple-card !p-8 hover:translate-x-2 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-black scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />

                            <div className="flex justify-between items-start text-left">
                                <div className="flex gap-8">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center border border-slate-100 group-hover:bg-black group-hover:border-black transition-all duration-500 shadow-sm relative overflow-hidden">
                                        <Building2 className="text-slate-400 group-hover:text-white transition-all duration-500 z-10" size={36} />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-black transition-colors">{job.title}</h3>
                                        <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                                            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-default"><Building2 size={16} />{job.company}</span>
                                            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-default"><MapPin size={16} />{job.district || job.location}</span>
                                            <span className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-default"><Calendar size={16} />{job.posted || 'Recent'}</span>
                                        </div>
                                        <div className="flex gap-2.5 mt-6">
                                            {(job.skills || []).slice(0, 4).map(skill => (
                                                <span key={skill} className="bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 border border-slate-100 uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all duration-300">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end gap-4 min-w-[200px]">
                                    <div className="flex items-center gap-2 bg-slate-900 px-6 py-2.5 rounded-2xl shadow-xl shadow-black/10">
                                        <Star className="text-white fill-white" size={16} />
                                        <span className="text-white font-black text-[15px] tracking-tight">{job.matchScore || job.match || 85}% AI Match</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{job.workType || job.type || 'Remote'}</span>
                                    </div>
                                    <div className="flex flex-col gap-3 mt-6">
                                        {job.originalUrl && (
                                            <a
                                                href={job.originalUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-apple-primary w-full flex items-center justify-center gap-2"
                                            >
                                                Apply at Source
                                                <ExternalLink size={18} />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleApply(job)}
                                            disabled={applyMutation.isPending}
                                            className={`${job.originalUrl ? 'btn-apple-secondary' : 'btn-apple-primary'} w-full group/btn disabled:opacity-50`}
                                        >
                                            {applyMutation.isPending && selectedJob?._id === job._id ? 'Processing...' : 'Quick Apply (HireAI)'}
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <JobApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                job={selectedJob}
                candidate={defaultCandidate}
                onConfirm={confirmApply}
                isPending={applyMutation.isPending}
            />
        </div>
    );
};

export default Job_Recommendation;
