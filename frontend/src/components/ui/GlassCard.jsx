import { motion } from 'framer-motion';

export const GlassCard = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = false, 
  glowColor = 'indigo', 
  onClick, 
  ...props 
}) => {
  const getGlowClass = () => {
    if (!glow) return '';
    if (glowColor === 'cyan') return 'shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] border-brand-cyan/30';
    if (glowColor === 'rose') return 'shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] border-rose-500/30';
    if (glowColor === 'emerald') return 'shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/30';
    return 'shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] border-brand-indigo/30';
  };

  const CardComponent = onClick ? motion.button : motion.div;

  return (
    <CardComponent
      onClick={onClick}
      whileHover={hover ? { scale: 1.015, y: -2 } : undefined}
      whileTap={hover && onClick ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className={`
        glass-card
        ${getGlowClass()}
        ${onClick ? 'cursor-pointer text-left w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default GlassCard;
