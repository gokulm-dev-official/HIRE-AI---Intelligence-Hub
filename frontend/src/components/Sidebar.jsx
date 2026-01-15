import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Search, CheckCircle, Settings, HelpCircle, BarChart2, MessageSquare, Sparkles, Target, User, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const navItems = [
        { name: 'Insights', icon: LayoutDashboard, path: '/' },
        { name: 'Talent Pool', icon: BarChart2, path: '/candidates' },
        { name: 'Ingest Resume', icon: FileText, path: '/upload' },
        { name: 'Bulk Ingestion', icon: Sparkles, path: '/bulk' },
        { name: 'ATS Check', icon: Target, path: '/ats-check' },
        { name: 'Semantic Match', icon: Briefcase, path: '/jobs' },
        { name: 'Pipeline', icon: CheckCircle, path: '/applications' },
        { name: 'About System', icon: User, path: '/about' },
    ];

    return (
        <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 z-50 flex flex-col p-10 px-8 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            {/* Mobile Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full md:hidden hover:text-red-500"
            >
                <X size={20} />
            </button>

            {/* Logo - Minimalist Apple Style */}
            <div
                className="flex items-center gap-4 mb-12 cursor-pointer group px-2"
                onClick={() => navigate('/')}
            >
                <div className="w-11 h-11 bg-black rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-5 h-5 border-2 border-white rounded-md rotate-12 group-hover:rotate-45 transition-transform duration-500" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black text-slate-900 tracking-tighter">
                        HIRE AI
                    </h1>
                    <span className="text-[9px] text-slate-400 font-black tracking-[0.3em] uppercase -mt-0.5">Enterprise</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-300 mb-6 ml-4">Workspace</div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => window.innerWidth < 768 && onClose && onClose()}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-slate-50 text-slate-900 shadow-sm border border-slate-100'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50/50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={`${isActive ? 'text-black' : 'text-slate-400'} group-hover:scale-110 transition-transform`} />
                                <span className="font-bold text-[15px] tracking-tight">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-indicator"
                                        className="ml-auto w-1.5 h-1.5 bg-black rounded-full"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="mt-auto space-y-2 pt-8 border-t border-slate-50">
                <button className="flex items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-slate-900 transition-all text-[14px] font-bold group">
                    <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" /> Settings
                </button>
                <div className="p-4 bg-slate-50 rounded-2xl mt-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-900">AI Engine Online</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
