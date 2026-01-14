import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
            <Sidebar />
            <main className="flex-1 ml-72 p-12 min-h-screen relative">
                {/* Global Header - Google/Apple Minimalist */}
                <header className="flex justify-between items-center mb-16 px-2">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-slate-900 tracking-tight"
                        >
                            Intelligence Hub
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 mt-2 font-medium text-lg leading-relaxed"
                        >
                            Orchestrating talent with RAG-powered insights
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-black/10">
                            <span className="text-sm font-black text-white">HI</span>
                        </div>
                    </div>
                </header>

                <motion.div
                    key={window.location.pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.div>

                {/* Global AI Chat */}
                <ChatBot />
            </main>
        </div>
    );
};

export default DashboardLayout;
