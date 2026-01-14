import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { aiService } from '../services/api';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Hello! I am HireAI. Ask me to find specific candidates (e.g., "Show me MERN stack developers").' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsTyping(true);

        try {
            // Send history excluding the last message (which is the current prompt)
            const history = messages.slice(-6).map(m => ({ role: m.role, content: m.text }));
            const res = await aiService.chat(input, history);
            const aiMsg = {
                role: 'ai',
                text: res.data.answer,
                matches: res.data.matches,
                explanation: res.data.explanation
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-[400px] h-[600px] flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="bg-black p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">Intelligence Assistant</h4>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">RAG Engine Active</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <Minimize2 size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none shadow-sm'
                                        }`}>
                                        {msg.text}
                                        {msg.explanation && (
                                            <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
                                                {msg.explanation}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                                        <Loader2 className="animate-spin text-accent" size={16} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Analyze my talent pool..."
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-sm focus:bg-white focus:border-accent outline-none transition-all"
                            />
                            <button type="submit" className="p-2 bg-black text-white rounded-xl hover:bg-slate-800 transition-colors">
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl shadow-black/20 group"
            >
                <Bot size={28} className="group-hover:rotate-12 transition-transform" />
            </motion.button>
        </div>
    );
};

export default ChatBot;
