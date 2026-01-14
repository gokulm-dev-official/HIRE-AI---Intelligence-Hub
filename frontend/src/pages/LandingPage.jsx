import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Zap, Shield, BarChart3, Users, Cpu } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const features = [
        { icon: Zap, title: "AI Resume Parsing", desc: "Structured extraction of skills, experience, and education in seconds." },
        { icon: Cpu, title: "RAG matching", desc: "Advanced semantic search and candidate ranking using LLMs." },
        { icon: BarChart3, title: "Hiring Analytics", desc: "Real-time insights into your recruitment pipeline and diversity." },
        { icon: Shield, title: "Bias Neutralization", desc: "Ensuring fair hiring by masking sensitive candidate data during initial reviews." }
    ];

    return (
        <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                        Recruitment <br />
                        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Redefined by AI
                        </span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        HireAI is an enterprise-grade ATS built with RAG technology to find the best candidates with zero bias.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                        >
                            Get Started <Briefcase size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-secondary text-lg px-8 py-3"
                        >
                            Sign In
                        </button>
                    </div>
                </motion.div>

                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-row-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 hover:bg-white/[0.08] transition-all cursor-default group"
                        >
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <f.icon className="text-primary" size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
