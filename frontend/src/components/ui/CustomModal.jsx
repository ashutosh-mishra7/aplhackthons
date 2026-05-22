import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const CustomModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-lg',
  showClose = true 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl p-6 z-10 overflow-hidden theme-transition`}
          >
            {/* Holographic glowing scan line effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-right from-brand-cyan via-brand-violet to-brand-indigo opacity-80 animate-scan" />
            
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                {title && (
                  <h3 className="font-display font-bold text-slate-100 text-lg uppercase tracking-wide">
                    {title}
                  </h3>
                )}
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="text-slate-300">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CustomModal;
