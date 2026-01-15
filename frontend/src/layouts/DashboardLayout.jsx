import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBot from '../components/ChatBot';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 w-full md:ml-72 p-6 md:p-12 min-h-screen relative transition-all duration-300">
                {/* Global Header */}
                <header className="flex justify-between items-center mb-10 md:mb-16">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 md:hidden text-slate-600 active:scale-95 transition-transform"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight"
                            >
                                Intelligence Hub
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-slate-500 mt-1 md:mt-2 font-medium text-sm md:text-lg leading-relaxed hidden md:block"
                            >
                                Orchestrating talent with RAG-powered insights
                            </motion.p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-black/10">
                            <span className="text-xs md:text-sm font-black text-white">HI</span>
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
