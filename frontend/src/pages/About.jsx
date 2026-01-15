import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, Target, Cpu, Code2, Globe, Sparkles } from 'lucide-react';

const About = () => {
    const config = {
        name: import.meta.env.VITE_ABOUT_NAME || "Gokul M",
        role: import.meta.env.VITE_ABOUT_ROLE || "Full Stack Engineer & AI Researcher",
        bio: import.meta.env.VITE_ABOUT_BIO || "I create clean, modern websites using high-performance technologies and enjoy building impactful AI healthcare solutions.",
        github: import.meta.env.VITE_ABOUT_GITHUB || "#",
        linkedin: import.meta.env.VITE_ABOUT_LINKEDIN || "#",
        email: import.meta.env.VITE_ABOUT_EMAIL || "gokulxmg26@gmail.com",
        phone: import.meta.env.VITE_ABOUT_PHONE || "+91 6382024508",
        projectFocus: import.meta.env.VITE_ABOUT_PROJECT_FOCUS || "Advanced LungAI Diagnostic System"
    };

    const skills = [
        "React", "Express.js", "MongoDB", "Node.js", "Python",
        "TensorFlow", "Tailwind CSS", "Vite"
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto space-y-8 pb-12"
        >
            {/* Header Hero Card */}
            <motion.div variants={itemVariants} className="apple-card !p-12 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-black to-transparent opacity-10 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full mb-8">
                    <Sparkles size={14} className="text-black" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lead Architect</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4 uppercase">
                    {config.name}
                </h1>
                <p className="text-2xl font-bold text-slate-400 mb-8 tracking-tight">
                    {config.role}
                </p>
                <blockquote className="text-xl text-slate-500 max-w-2xl mx-auto italic font-medium leading-relaxed mb-10">
                    "{config.bio}"
                </blockquote>

                <div className="flex justify-center gap-4">
                    <a href={config.github} target="_blank" rel="noopener noreferrer" className="btn-apple-primary px-8">
                        <Github size={20} /> GitHub
                    </a>
                    <a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="bg-[#0077b5] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#0077b5]/10">
                        <Linkedin size={20} /> LinkedIn
                    </a>
                    <a href={`mailto:${config.email}`} className="bg-[#ea4335] text-white px-8 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-[#ea4335]/10">
                        <Mail size={20} /> Gmail
                    </a>
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Communication Registry */}
                <motion.div variants={itemVariants} className="apple-card space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Globe size={20} className="text-slate-900" />
                        <h2 className="text-lg font-black tracking-tight">Communication Registry</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-colors hover:border-black/10">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Mail size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Primary Gmail</p>
                                <p className="font-bold text-slate-900">{config.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-colors hover:border-black/10">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Phone size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Mobile Terminal</p>
                                <p className="font-bold text-slate-900">{config.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-colors hover:border-black/10">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Target size={20} className="text-slate-400" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Project Focus</p>
                                <p className="font-bold text-slate-900">{config.projectFocus}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* System Bio & Skills */}
                <motion.div variants={itemVariants} className="apple-card space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Cpu size={20} className="text-slate-900" />
                        <h2 className="text-lg font-black tracking-tight">System Bio & Skills</h2>
                    </div>

                    <p className="text-slate-500 font-medium italic leading-relaxed border-l-2 border-black/5 pl-6 py-2">
                        "Passionate developer specialized in building AI-integrated medical healthcare systems and high-performance web applications."
                    </p>

                    <div className="pt-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-4">Core Competencies</p>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <span key={skill} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black tracking-tight hover:scale-105 transition-transform cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.footer variants={itemVariants} className="text-center pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
                    Proprietary Design by Gokul M © 2026
                </p>
            </motion.footer>
        </motion.div>
    );
};

export default About;
