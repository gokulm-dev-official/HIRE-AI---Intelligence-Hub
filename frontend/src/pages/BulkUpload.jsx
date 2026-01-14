import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateService } from '../services/api';
import { Upload, X, FileText, Loader2, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BulkUpload = () => {
    const queryClient = useQueryClient();
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle'); // idle, uploading, completed
    const [results, setResults] = useState(null);

    const mutation = useMutation({
        mutationFn: candidateService.bulk,
        onSuccess: (res) => {
            setStatus('completed');
            setResults(res.data.data);
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
        onError: () => {
            setStatus('idle');
            alert('Bulk upload failed. Please try again.');
        }
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = () => {
        if (files.length === 0) return;

        setStatus('uploading');
        const formData = new FormData();
        files.forEach(file => {
            formData.append('resumes', file);
        });

        mutation.mutate(formData);
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="apple-card !p-12 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-900 overflow-hidden">
                    {status === 'uploading' && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            className="h-full bg-blue-500 w-1/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    )}
                </div>

                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20">
                    <Sparkles className="text-white" size={32} />
                </div>

                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Neural Bulk Ingestion</h2>
                <p className="text-slate-400 font-bold max-w-md mx-auto mb-12">
                    Upload multiple resumes to process them simultaneously with AI-driven extraction.
                </p>

                {status === 'idle' && (
                    <div className="space-y-8">
                        <label className="block border-2 border-dashed border-slate-100 rounded-[2.5rem] p-16 hover:border-black hover:bg-slate-50 transition-all cursor-pointer group">
                            <input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                            <Upload className="mx-auto mb-6 text-slate-300 group-hover:text-black transition-colors" size={48} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Drop resume files here or click to browse</p>
                        </label>

                        {files.length > 0 && (
                            <div className="space-y-4">
                                <div className="max-h-[300px] overflow-y-auto px-4 space-y-3">
                                    {files.map((file, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl"
                                        >
                                            <div className="flex items-center gap-4">
                                                <FileText className="text-slate-400" size={20} />
                                                <div className="text-left">
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{file.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button onClick={() => removeFile(idx)} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors">
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <button
                                    onClick={handleUpload}
                                    className="btn-apple-primary w-full py-5 text-lg"
                                >
                                    Initialize Bulk Ingestion ({files.length} Files)
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="py-20 flex flex-col items-center gap-8">
                        <Loader2 className="animate-spin text-slate-900" size={64} />
                        <div className="space-y-2">
                            <p className="text-xl font-black text-slate-900 tracking-tight">Syncing Intelligence Matrix...</p>
                            <p className="text-slate-400 font-bold animate-pulse">Running AI extraction on multiple threads</p>
                        </div>
                    </div>
                )}

                {status === 'completed' && results && (
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] text-center">
                                <p className="text-4xl font-black text-emerald-600 mb-2">{results.success.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Successful Ingestions</p>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] text-center">
                                <p className="text-4xl font-black text-rose-600 mb-2">{results.failed.length}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Failed Records</p>
                            </div>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto px-4 space-y-3 mb-10 text-left">
                            {results.success.map((res, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/30 rounded-xl border border-emerald-100/50">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                    <span className="text-xs font-bold text-slate-700">{res.filename}</span>
                                </div>
                            ))}
                            {results.failed.map((res, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-rose-50/30 rounded-xl border border-rose-100/50">
                                    <AlertCircle size={16} className="text-rose-500" />
                                    <span className="text-xs font-bold text-slate-700">{res.filename}: {res.error}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => { setStatus('idle'); setFiles([]); setResults(null); }}
                            className="btn-apple-secondary w-full py-5"
                        >
                            Return to Ingestion Hub
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default BulkUpload;
