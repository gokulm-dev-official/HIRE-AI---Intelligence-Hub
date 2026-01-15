import React, { useState } from 'react';
import { Upload, X, CheckCircle, File, Loader2, Sparkles, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { candidateService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ResumeUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await candidateService.upload(formData);
            if (onUploadSuccess) onUploadSuccess(response.data);
            setFile(null);
            navigate('/candidates');
        } catch (error) {
            console.error('Upload failed:', error);
            setError(error.response?.data?.message || 'AI indexing failed. Please verify the file format.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 mb-6"
                >
                    <Database size={14} /> Data Ingestion Pipeline
                </motion.div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Scale Your Talent Pool <br />
                    <span className="text-slate-400">with Neural Indexing</span>
                </h2>
                <p className="text-slate-500 mt-6 font-medium text-lg max-w-xl mx-auto">
                    Upload resumes to automatically parse skills, generate embeddings, and enable RAG-based semantic search.
                </p>
            </div>

            <div className="apple-card !p-12 shadow-2xl shadow-slate-200/50">
                <div
                    className={`border-4 border-dashed rounded-[2.5rem] p-24 flex flex-col items-center justify-center transition-all duration-500
                    ${file ? 'border-black/5 bg-slate-50 scale-[0.98]' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'}`}
                >
                    <input
                        type="file"
                        id="resume-upload"
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                    />

                    <AnimatePresence mode='wait'>
                        {!file ? (
                            <motion.label
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                htmlFor="resume-upload"
                                className="cursor-pointer flex flex-col items-center transition-transform active:scale-95"
                            >
                                <div className="w-24 h-24 bg-white shadow-xl shadow-slate-200 rounded-[2rem] flex items-center justify-center mb-10 group hover:rotate-6 transition-all duration-500">
                                    <Upload className="text-black" size={32} />
                                </div>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">Relinquish Resume</p>
                                <p className="text-slate-400 font-bold text-sm mt-3 tracking-wide uppercase">PDF or DOCX • Seamless AI Parsing</p>
                            </motion.label>
                        ) : (
                            <motion.div
                                key="selected"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center w-full max-w-md"
                            >
                                <div className="w-28 h-28 bg-black rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-black/20">
                                    <Sparkles className="text-white" size={40} />
                                </div>
                                <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 flex items-center gap-6 shadow-sm">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                                        <File className="text-slate-900" size={28} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-slate-900 text-lg tracking-tight truncate">{file.name}</p>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • Analyzing Structure
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl mt-8 text-sm font-bold flex items-center gap-4"
                    >
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        {error}
                    </motion.div>
                )}

                <button
                    disabled={!file || isUploading}
                    onClick={handleUpload}
                    className={`w-full mt-10 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all transform
                    ${file && !isUploading
                            ? 'bg-black text-white shadow-2xl shadow-black/20 hover:brightness-125 hover:-translate-y-1 active:scale-[0.98]'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200'}`}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="animate-spin" size={28} />
                            Neural Deconstruction...
                        </>
                    ) : (
                        <>
                            <Sparkles size={28} />
                            Ingest Talent Data
                        </>
                    )}
                </button>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Semantic Parsing", desc: "LLM-driven field extraction for zero-loss data recovery." },
                    { title: "Vector Indexing", desc: "Generating high-dimensional embeddings for semantic RAG search." },
                    { title: "Automated Scoring", desc: "Instant candidate-to-job matching based on latent requirements." }
                ].map((f, i) => (
                    <div key={i} className="px-4 text-center">
                        <h4 className="font-black text-slate-900 text-lg tracking-tight mb-2">{f.title}</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeUpload;
