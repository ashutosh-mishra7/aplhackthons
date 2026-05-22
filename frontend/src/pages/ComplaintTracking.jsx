import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Cpu, 
  MapPin, 
  Clock, 
  Languages,
  Smile,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DeptTag } from '../components/ui/DeptTag';
import { ConfidenceMeter } from '../components/ui/ConfidenceMeter';
import { complaintService } from '../services/complaintService';

export const ComplaintTracking = () => {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const ticketIdParam = searchParams.get('ticketId');

  const [searchQuery, setSearchQuery] = useState('');
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // Quick select tickets for hackathon judges
  const quickTickets = ['JM-2026-9821', 'JM-2026-4439', 'JM-2026-7712', 'JM-2026-1188'];

  const handleSearch = useCallback(async (id) => {
    setLoading(true);
    setTicket(null);
    try {
      const result = await complaintService.getById(id);
      setTicket(result);
      setSearchParams({ ticketId: id });
      addToast(`Ticket ${id} found.`, 'success');
    } catch {
      addToast('Ticket ID not found. Verify standard seeds.', 'error');
    } finally {
      setLoading(false);
    }
  }, [setSearchParams, addToast]);

  useEffect(() => {
    if (ticketIdParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery(ticketIdParam);
      handleSearch(ticketIdParam);
    }
  }, [ticketIdParam, handleSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    handleSearch(searchQuery.trim());
  };

  // Timeline configuration
  const stages = ['Submitted', 'AI Analyzed', 'Assigned', 'In Progress', 'Resolved'];

  const getStageIndex = (status) => {
    const norm = status.toLowerCase();
    if (norm === 'submitted') return 0;
    if (norm === 'ai analyzed') return 1;
    if (norm === 'assigned') return 2;
    if (norm === 'in progress') return 3;
    if (norm === 'resolved') return 4;
    if (norm === 'escalated') return 3; // Escalated lies in active routing execution
    return 0;
  };

  const activeStageIndex = ticket ? getStageIndex(ticket.status) : 0;

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Page Header */}
      <div className="text-left mb-8">
        <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">Citizen Hub Gateway</span>
        <h1 className="font-display font-bold text-3xl text-slate-100 mt-1 uppercase tracking-wide">
          Track Grievance Status
        </h1>
      </div>

      {/* Quick Select Panel */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 bg-[#090d16]/60 border border-slate-800 p-4 rounded-xl text-left">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Quick Seeds (For Judges):</span>
        <div className="flex flex-wrap gap-2">
          {quickTickets.map((id) => (
            <button
              key={id}
              onClick={() => {
                setSearchQuery(id);
                handleSearch(id);
              }}
              className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                searchQuery === id 
                  ? 'bg-brand-cyan text-slate-950 border-brand-cyan shadow-md' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-3 mb-10">
        <input
          type="text"
          placeholder="Input Ticket track ID (e.g. JM-2026-9821)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors flex-1 uppercase tracking-widest font-mono"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-bold uppercase tracking-wider text-slate-100 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1.5 shadow-lg shrink-0"
        >
          <Search className="w-4 h-4" />
          Query Ticket
        </button>
      </form>

      {/* Content Render */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-20 flex flex-col items-center gap-3 text-slate-500"
          >
            <Cpu className="w-8 h-8 text-brand-cyan animate-spin" />
            <span className="text-xs font-mono tracking-widest uppercase">Fetching Ledger Log...</span>
          </motion.div>
        ) : ticket ? (
          <motion.div
            key="ticket-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left"
          >
            {/* Left Col: Main details, summaries & translations */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <GlassCard className="p-6 md:p-8 flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">TICKET ID</span>
                    <span className="text-2xl font-mono font-bold text-brand-cyan">{ticket.id}</span>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">CURRENT STATUS</span>
                    <StatusBadge type="status" value={ticket.status} />
                  </div>
                </div>

                <div className="h-[1px] bg-slate-800" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Citizen Name</span>
                    <span className="text-sm font-semibold text-slate-200">{ticket.citizenName}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Municipal Ward / Area</span>
                    <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-cyan" />
                      {ticket.area}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Complaint Title</span>
                  <span className="text-sm font-semibold text-slate-200 leading-snug">{ticket.title}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Description</span>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3.5 rounded-lg border border-slate-850">
                    {ticket.description}
                  </p>
                </div>
              </GlassCard>

              {/* Cognitive Summary Translations */}
              <GlassCard className="p-6 md:p-8 flex flex-col gap-5 border-brand-indigo/15">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-brand-indigo" />
                  <h3 className="font-display font-bold text-slate-200 text-sm tracking-wide uppercase">AI Multi-Lingual Summary</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 p-4 bg-slate-950/60 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">
                      <span>English Summary</span>
                      <span className="text-brand-cyan">NLP Output</span>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed mt-1">{ticket.aiAnalysis.summary_en}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-4 bg-slate-950/60 rounded-xl border border-slate-850">
                    <div className="flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500 font-bold font-mono">
                      <span>Hindi Summary (हिंदी संक्षेप)</span>
                      <span className="text-brand-indigo">अनुवाद</span>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed mt-1 font-sans">{ticket.aiAnalysis.summary_hi}</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right Col: AI Routing Details & Dynamic Timeline */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <GlassCard className="p-5 flex flex-col gap-4">
                <span className="text-[10px] uppercase tracking-widest text-brand-cyan font-extrabold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  AI Routing Metadata
                </span>
                
                <div className="h-[1px] bg-slate-850" />
                
                <ConfidenceMeter value={ticket.aiAnalysis.ai_confidence_score} />
                
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Allocated Department</span>
                  <DeptTag department={ticket.aiAnalysis.department} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Urgency</span>
                    <StatusBadge type="priority" value={ticket.aiAnalysis.urgency} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Priority Weight</span>
                    <span className="text-base font-bold font-mono text-slate-200">{ticket.aiAnalysis.priority_score} / 100</span>
                  </div>
                </div>

                {/* Sentiment node info */}
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-lg border border-slate-850">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-brand-cyan" />
                    <span className="text-[10px] uppercase font-bold text-slate-500">Parsed Sentiment</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-350">{ticket.aiAnalysis.sentiment}</span>
                </div>

                {/* SLA Risk alert */}
                {ticket.aiAnalysis.requires_escalation && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-rose-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Breach Risk Escalation active</span>
                  </div>
                )}
              </GlassCard>

              {/* Timeline Progress */}
              <GlassCard className="p-5 flex flex-col gap-5">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-extrabold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Grievance Roadmap
                </span>

                <div className="flex flex-col gap-6 relative pl-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                  {stages.map((stage, idx) => {
                    const active = idx <= activeStageIndex;
                    const timelineEvent = ticket.timeline.find(e => {
                      if (stage === 'Assigned') return e.status === 'Assigned' || e.status === 'AI Analyzed';
                      return e.status.toLowerCase() === stage.toLowerCase();
                    });

                    let circleColor = 'border-slate-800 bg-[#070b13]';
                    if (active) {
                      circleColor = stage === 'Resolved' 
                        ? 'border-emerald-500 bg-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                        : 'border-brand-cyan bg-brand-cyan/20 shadow-[0_0_8px_rgba(6,182,212,0.4)]';
                    }

                    return (
                      <div key={stage} className="relative flex flex-col gap-1 text-left">
                        {/* Node circle */}
                        <div className={`absolute -left-[20px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${circleColor}`} />
                        
                        <span className={`text-xs font-bold uppercase tracking-wider ${
                          active ? 'text-slate-200' : 'text-slate-500'
                        }`}>
                          {stage}
                        </span>
                        
                        {timelineEvent ? (
                          <div className="flex flex-col text-[10px] text-slate-400">
                            <span className="text-brand-cyan">{new Date(timelineEvent.timestamp).toLocaleDateString()} | {new Date(timelineEvent.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="mt-0.5 leading-snug">{timelineEvent.description}</span>
                          </div>
                        ) : (
                          active && idx === activeStageIndex && (
                            <span className="text-[10px] text-slate-500 italic">Processing active...</span>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center justify-center text-center gap-4 text-slate-500 bg-slate-900/35 border border-slate-850 rounded-xl"
          >
            <Search className="w-10 h-10 text-slate-700 animate-pulse" />
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-display font-semibold text-slate-350 text-sm">No Grievance Selected</h3>
              <p className="text-xs leading-relaxed">
                Input your JanMitra ticket track ID above, or click one of the quick seed values to inspect simulated platform telemetry.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComplaintTracking;
