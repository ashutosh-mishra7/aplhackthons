import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, Navigation } from 'lucide-react';
import { pageTransition } from '../animations/pageTransition';

export const PublicLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { path: '/', label: 'Citizen Hub' },
    { path: '/submit', label: 'File Grievance' },
    { path: '/track', label: 'Track Status' },
    { path: '/admin', label: 'Admin Terminal' },
    { path: '/ai-monitoring', label: 'AI Operations' },
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 ai-grid-bg relative overflow-x-hidden theme-transition selection:bg-brand-cyan/30">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-brand-indigo/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060911]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative p-2 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-cyan shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Shield className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-slate-100 text-base tracking-wider leading-none">
                JANMITRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">AI</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-widest mt-0.5">SMART GOVERNANCE OS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const active = currentPath === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 relative ${
                    active 
                      ? 'text-brand-cyan font-bold' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-brand-cyan shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            <Link
              to="/submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-bold uppercase tracking-wider text-slate-100 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all flex items-center gap-1.5 shadow-lg border border-brand-indigo/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              File Complaint
            </Link>
          </div>
        </div>
      </header>

      {/* Main Layout Area with route Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative min-h-[calc(100vh-12rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060911]/90 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs text-slate-400 font-semibold tracking-wider">
              Inspired by Lucknow Nagar Nigam & UP Jansunwai Portal. Built for Smart City Governance.
            </span>
          </div>
          <div className="text-xs text-slate-500">
            &copy; 2026 JanMitra AI Governance. All systems operational.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
