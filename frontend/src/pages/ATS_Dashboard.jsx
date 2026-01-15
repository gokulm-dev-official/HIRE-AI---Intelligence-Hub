import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { User, Award, TrendingUp, AlertCircle, Loader2, ArrowUpRight, Search } from 'lucide-react';
import { candidateService } from '../services/api';
import { motion } from 'framer-motion';

const ATS_Dashboard = () => {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const { data: candidatesRes, isLoading } = useQuery({
        queryKey: ['candidates'],
        queryFn: candidateService.getAll
    });

    const candidates = candidatesRes?.data?.data || [];

    const stats = [
        { label: 'Total Candidates', value: candidates.length, icon: User, change: '+12% this month', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Hiring Fairness', value: '98.2%', icon: Award, change: 'Stable', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Match Accuracy', value: '94%', icon: TrendingUp, change: '+5% improvement', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Processing Latency', value: '1.2s', icon: AlertCircle, change: 'Optimized', color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    const biasData = [
        { name: 'Gender', score: 2, risk: 'Low' },
        { name: 'Age', score: 3, risk: 'Low' },
        { name: 'University', score: 4, risk: 'Normal' },
        { name: 'Ethnicity', score: 1, risk: 'None' },
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
                <Loader2 className="animate-spin text-slate-900" size={48} />
                <p className="text-slate-400 font-bold tracking-tight">Syncing Intelligence Matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Minimalist Search Bar */}
            <div className="relative max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search candidate database with semantic intent..."
                    className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-16 pr-8 text-slate-900 shadow-xl shadow-slate-100 underline-none focus:border-black transition-all duration-300 placeholder:text-slate-400"
                />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="apple-card hover:translate-y-[-4px]"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={26} />
                            </div>
                            <ArrowUpRight className="text-slate-200" size={20} />
                        </div>
                        <h4 className="text-slate-400 text-[13px] font-black uppercase tracking-[0.1em]">{stat.label}</h4>
                        <p className="text-3xl md:text-4xl font-black text-slate-900 mt-2 tracking-tighter">{stat.value}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-3">{stat.change}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Candidates Table - Ultra Clean */}
                <div className="lg:col-span-2 apple-card-glass shadow-sm !p-0 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Ingestions</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button className="flex-1 md:flex-none px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-all">Export</button>
                            <button className="flex-1 md:flex-none px-5 py-2 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl">View Grid</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[14px] min-w-[800px]">
                            <thead className="bg-slate-50/50 text-slate-400">
                                <tr>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Candidate Profile</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">AI Score</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Processing</th>
                                    <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {candidates.map((candidate) => (
                                    <tr key={candidate._id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-900 group-hover:bg-black group-hover:text-white transition-all duration-500">
                                                    {candidate.firstName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-bold text-[15px] tracking-tight">{candidate.firstName} {candidate.lastName}</p>
                                                    <p className="text-slate-400 text-xs font-medium mt-0.5">{candidate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${candidate.atsScore || 50}%` }}
                                                        className="h-full bg-black rounded-full"
                                                    />
                                                </div>
                                                <span className="text-slate-900 font-black text-xs">{candidate.atsScore || 50}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">
                                                {candidate.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-slate-400 hover:text-black font-black text-[11px] uppercase tracking-widest transition-all">Analyze</button>
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-24 text-slate-300 font-bold italic tracking-tight">No intelligence data ingested yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Chart - Minimalist Recharts */}
                <div className="apple-card flex flex-col h-[500px]">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-10">Bias Analysis (AI)</h3>
                    <div className="flex-1 w-full relative min-h-[300px]">
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={biasData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        fontWeight="bold"
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #f1f5f9',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={24}>
                                        {biasData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.score > 5 ? '#000000' : '#e2e8f0'} className="hover:fill-black transition-all duration-300" />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="mt-10 space-y-6">
                        {biasData.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-slate-500 font-bold text-sm tracking-tight">{item.name} Match</span>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${item.score > 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {item.risk} Risk
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${item.score > 5 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATS_Dashboard;
