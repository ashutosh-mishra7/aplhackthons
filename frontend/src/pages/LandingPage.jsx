import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  Clock, 
  Languages, 
  Activity,
  Bot
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { fadeUp } from '../animations/fadeUp';
import { staggerContainer } from '../animations/staggerContainer';
import { floatingAnimation } from '../animations/floatingAnimation';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const analyticsMiniData = [
  { day: 'Mon', active: 120, resolved: 85 },
  { day: 'Tue', active: 145, resolved: 110 },
  { day: 'Wed', active: 130, resolved: 125 },
  { day: 'Thu', active: 165, resolved: 140 },
  { day: 'Fri', active: 180, resolved: 168 },
  { day: 'Sat', active: 155, resolved: 150 },
  { day: 'Sun', active: 195, resolved: 190 }
];

export const LandingPage = () => {
  // Mouse hover gradient movement tracker
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 250 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // Stats counting animation simulation
  const [ticketCount, setTicketCount] = useState(14500);

  useEffect(() => {
    const countInterval = setInterval(() => {
      setTicketCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 4000);
    return () => clearInterval(countInterval);
  }, []);

  return (
    <div 
      className="relative w-full"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive mouse follow glow card layer */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none hidden md:block"
        style={{
          left: glowX,
          top: glowY,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 1. Cinematic Hero Section */}
      <section className="py-12 md:py-24 flex flex-col items-center text-center relative overflow-hidden">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer()}
          className="max-w-4xl flex flex-col items-center gap-6"
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={fadeUp(0, 0.4)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-indigo/35 bg-brand-indigo/10 text-xs font-semibold text-brand-cyan tracking-wider uppercase"
          >
            <Bot className="w-4 h-4 text-brand-cyan" />
            Empowering UP Governance with AI Node Routing
          </motion.div>

          {/* Glowing Headline */}
          <motion.h1 
            variants={fadeUp(0.1, 0.5)}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-slate-100"
          >
            The Intelligent Operating System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-indigo to-brand-violet drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              Smart Cities
            </span>
          </motion.h1>

          <motion.p 
            variants={fadeUp(0.2, 0.5)}
            className="text-base sm:text-lg md:text-xl text-slate-400 font-sans max-w-2xl leading-relaxed"
          >
            Bridge the gap between citizens and administration. JanMitra AI parses, translates, categorizes, and dispatches city grievances to Lucknow Nagar Nigam departments in 60 seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeUp(0.3, 0.5)}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link
              to="/submit"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet text-sm font-bold uppercase tracking-wider text-slate-100 shadow-xl hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2 border border-brand-indigo/20"
            >
              File Grievance Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/track"
              className="px-8 py-3 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Track Complaint Status
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Governance Cards Mockup Visuals */}
        <div className="relative w-full max-w-5xl mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative rounded-xl border border-slate-800 bg-[#080d17]/50 backdrop-blur-md overflow-hidden shadow-2xl p-4 sm:p-6"
          >
            {/* Holographic Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6 text-xs text-slate-500 font-semibold tracking-wider uppercase">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>JANMITRA.OS ENGINE ACTIVE</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>MEM: 64.2%</span>
                <span>LATENCY: 290ms</span>
              </div>
            </div>

            {/* Simulated Live Analytics dashboard layout preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="md:col-span-2 flex flex-col gap-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Smart City Throughput Volume</span>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsMiniData}>
                      <defs>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #334155' }} />
                      <Area type="monotone" dataKey="active" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
                      <Area type="monotone" dataKey="resolved" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dynamic status routing simulation box */}
              <div className="flex flex-col gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-lg">
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-cyan" />
                  Live Routing Pipeline
                </span>
                <div className="flex flex-col gap-3 font-mono text-[10px] text-slate-400">
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 flex flex-col gap-1">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>TICKET CRITICAL</span>
                      <span className="text-rose-400">98% Match</span>
                    </div>
                    <span className="truncate">"transformer sparks halwasiya market"</span>
                    <span className="text-brand-cyan">Allocated: LESA-POWER</span>
                  </div>
                  <div className="p-2 bg-slate-950/40 rounded border border-slate-800/40 flex flex-col gap-1 opacity-70">
                    <div className="flex justify-between font-bold text-slate-300">
                      <span>TICKET MEDIUM</span>
                      <span className="text-emerald-400">91% Match</span>
                    </div>
                    <span className="truncate">"garbage accumulation aliganj sector H"</span>
                    <span className="text-brand-cyan">Allocated: LNN-SANITATION</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative floating badges */}
          <motion.div 
            variants={floatingAnimation(4, 10)}
            animate="animate"
            className="absolute top-10 -left-12 hidden lg:flex items-center gap-2 bg-[#090d16]/95 border border-slate-800 p-3 rounded-xl shadow-2xl"
          >
            <div className="p-1.5 bg-brand-cyan/10 rounded-lg text-brand-cyan">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Router precision</span>
              <span className="text-xs font-semibold text-slate-200">96.8% Accuracy</span>
            </div>
          </motion.div>

          <motion.div 
            variants={floatingAnimation(3.5, -8)}
            animate="animate"
            className="absolute bottom-16 -right-16 hidden lg:flex items-center gap-2 bg-[#090d16]/95 border border-slate-800 p-3 rounded-xl shadow-2xl"
          >
            <div className="p-1.5 bg-brand-indigo/10 rounded-lg text-brand-indigo">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg response</span>
              <span className="text-xs font-semibold text-slate-200">22 Mins Assigned</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Statistics Panel */}
      <section className="py-12 border-y border-slate-800/40 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-3xl sm:text-4xl text-slate-100 tracking-tight">
              {ticketCount.toLocaleString()}+
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Processed Tickets</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-indigo tracking-tight">
              94.6%
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">SLA Compliance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-3xl sm:text-4xl text-slate-100 tracking-tight">
              1.4 Days
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Avg Resolution Speed</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet tracking-tight">
              4.75 / 5
            </span>
            <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">Citizen Trust Rating</span>
          </div>
        </div>
      </section>

      {/* 3. AI Features Section Grid */}
      <section className="py-20 flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-bold text-brand-cyan tracking-widest uppercase">JANMITRA POWER SUITE</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Enterprise Cognitive Governance Layers
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Empowered with state-of-the-art NLP embeddings and automated workflows to accelerate community development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
          <GlassCard className="flex flex-col items-start text-left p-6 gap-4">
            <div className="p-2.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide uppercase">AI Routing Pipeline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly classifies citizen requests and dispatches work orders to relevant engineering sub-divisions within 60 seconds.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col items-start text-left p-6 gap-4">
            <div className="p-2.5 rounded-lg bg-brand-indigo/10 border border-brand-indigo/25 text-brand-indigo">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide uppercase">Citizen Sentiment</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects citizen panic, anxiety, or disgust metrics based on wording heuristics to adjust SLA priority coefficients dynamically.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col items-start text-left p-6 gap-4">
            <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/25 text-violet-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide uppercase">SLA Breach Prediction</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates processing throughput curves of active departments, automatically escalating tickets flagged at risk.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col items-start text-left p-6 gap-4">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Languages className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide uppercase">Multilingual AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts input in Hindi and English. Automatically compiles reports, Citizen Updates, and dispatch SMS instructions in Devnagari.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 4. CTA Banner Section */}
      <section className="py-12 max-w-5xl mx-auto w-full px-4 mb-12">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-brand-indigo/20 via-brand-violet/10 to-transparent p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col gap-2">
            <h3 className="font-display font-bold text-2xl text-slate-100 tracking-tight">Have a municipal grievance in Lucknow?</h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              File your complaint today. Our cognitive governance platform will evaluate, assign, and schedule municipal teams instantly.
            </p>
          </div>
          <Link
            to="/submit"
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-cyan to-brand-indigo text-xs font-bold uppercase tracking-wider text-slate-900 shadow-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all shrink-0"
          >
            Launch Submission Wizard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
