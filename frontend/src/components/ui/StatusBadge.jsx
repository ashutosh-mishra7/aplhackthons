import { Shield, CheckCircle2, RefreshCw, AlertTriangle, Send } from 'lucide-react';

export const StatusBadge = ({ type = 'status', value = '' }) => {
  const normValue = value.toLowerCase();
  
  if (type === 'priority' || type === 'urgency') {
    let classes = 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    let label = 'Low';
    
    if (normValue === 'critical') {
      classes = 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)] animate-pulse';
      label = 'CRITICAL';
    } else if (normValue === 'high') {
      classes = 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.15)]';
      label = 'HIGH';
    } else if (normValue === 'medium') {
      classes = 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]';
      label = 'MEDIUM';
    }
    
    return (
      <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold border tracking-wider flex items-center gap-1.5 w-fit ${classes}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {label}
      </span>
    );
  }

  // Otherwise, standard complaint status
  let classes = 'bg-slate-500/10 border-slate-500/30 text-slate-400';
  let icon = <Send className="w-3.5 h-3.5" />;
  let label = value;

  if (normValue === 'submitted') {
    classes = 'bg-slate-800 border-slate-700 text-slate-300';
    icon = <Send className="w-3.5 h-3.5" />;
    label = 'Submitted';
  } else if (normValue === 'ai analyzed') {
    classes = 'bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigo shadow-[0_0_8px_rgba(99,102,241,0.15)]';
    icon = <Shield className="w-3.5 h-3.5" />;
    label = 'AI Analyzed';
  } else if (normValue === 'assigned') {
    classes = 'bg-brand-cyan/10 border-brand-cyan/30 text-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.15)]';
    icon = <Shield className="w-3.5 h-3.5" />;
    label = 'Routed';
  } else if (normValue === 'in progress') {
    classes = 'bg-violet-500/10 border-violet-500/30 text-violet-400 animate-pulse';
    icon = <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />;
    label = 'In Progress';
  } else if (normValue === 'resolved') {
    classes = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    icon = <CheckCircle2 className="w-3.5 h-3.5" />;
    label = 'Resolved';
  } else if (normValue === 'escalated') {
    classes = 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.15)]';
    icon = <AlertTriangle className="w-3.5 h-3.5" />;
    label = 'Escalated';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${classes}`}>
      {icon}
      {label}
    </span>
  );
};

export default StatusBadge;
