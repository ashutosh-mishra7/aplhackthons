import { motion } from 'framer-motion';

export const ConfidenceMeter = ({ value = 90, size = 'md', showLabel = true }) => {
  const score = Math.max(0, Math.min(100, value));
  
  // Decide color scheme
  let color = 'stroke-emerald-400 text-emerald-400';
  let glow = 'shadow-[0_0_12px_rgba(16,185,129,0.3)] bg-emerald-500/10 border-emerald-500/20';
  
  if (score < 75) {
    color = 'stroke-rose-500 text-rose-500';
    glow = 'shadow-[0_0_12px_rgba(244,63,94,0.3)] bg-rose-500/10 border-rose-500/20';
  } else if (score < 90) {
    color = 'stroke-amber-400 text-amber-400';
    glow = 'shadow-[0_0_12px_rgba(245,158,11,0.3)] bg-amber-500/10 border-amber-500/20';
  }

  // Ring dimensions based on size
  const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;
  const radius = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizePx = size === 'sm' ? 48 : size === 'lg' ? 96 : 64;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: sizePx, height: sizePx }}>
        {/* Background Circle */}
        <svg className="w-full h-full -rotate-90">
          <circle
            className="stroke-slate-800"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={sizePx / 2}
            cy={sizePx / 2}
          />
          {/* Foreground Circle */}
          <motion.circle
            className={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
            r={radius}
            cx={sizePx / 2}
            cy={sizePx / 2}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-slate-100 text-xs">
          {score}%
        </div>
      </div>
      
      {showLabel && (
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">AI Match confidence</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`px-2 py-0.5 rounded text-[10px] border font-medium ${glow}`}>
              {score >= 90 ? 'High Precision' : score >= 75 ? 'Optimal' : 'Needs Review'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfidenceMeter;
