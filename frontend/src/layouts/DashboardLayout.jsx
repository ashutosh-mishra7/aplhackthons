import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  Activity, 
  Search, 
  Bell, 
  Menu, 
  X, 
  FileText, 
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { pageTransition } from '../animations/pageTransition';
import { aiMonitoringService } from '../services/aiMonitoringService';

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { addToast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [telemetry, setTelemetry] = useState({ cpuUsage: 45, averageLatencyMs: 310, queueSize: 1 });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ticket JM-2026-1188 requires immediate SLA review.', type: 'escalation', read: false },
    { id: 2, text: 'LESA department resolved transformer issue JM-2026-4439.', type: 'resolved', read: false },
    { id: 3, text: 'Nagar Nigam ward 5 sanitation latency alert.', type: 'alert', read: true }
  ]);

  // Fetch telemetry updates periodically
  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const stats = await aiMonitoringService.getEngineTelemetry();
        setTelemetry(stats);
      } catch {
        // Fail-safe
      }
    };
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 6000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const sidebarLinks = [
    { path: '/admin', label: 'Admin Terminal', icon: LayoutDashboard },
    { path: '/ai-monitoring', label: 'AI Control Center', icon: Activity },
    { path: '/submit', label: 'Citizen submission', icon: FileText },
    { path: '/track', label: 'Citizen tracking', icon: Search },
    { path: '/', label: 'Citizen Hub', icon: Shield },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Attempt to route to tracking page with the target ticket
    setSearchOpen(false);
    addToast(`Searching ticket log for: ${searchQuery}`, 'info');
    navigate(`/track?ticketId=${searchQuery.trim()}`);
    setSearchQuery('');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All notifications marked as read', 'success');
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex relative overflow-hidden theme-transition">
      {/* Background ambient lighting */}
      <div className="absolute top-[0%] right-[0%] w-[40%] h-[40%] rounded-full bg-brand-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[0%] left-[0%] w-[40%] h-[40%] rounded-full bg-brand-indigo/5 blur-[120px] pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside 
        className={`hidden md:flex flex-col bg-[#080d17]/95 border-r border-slate-800/80 z-30 transition-all duration-300 relative ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/60">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2 rounded-lg bg-gradient-to-br from-brand-indigo to-brand-cyan shrink-0">
              <Shield className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-slate-100 text-sm tracking-wider leading-none">
                  JANMITRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-violet">AI</span>
                </span>
                <span className="text-[8px] text-slate-400 font-semibold tracking-widest mt-0.5">ADMIN PANEL</span>
              </div>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const active = currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all relative ${
                  active 
                    ? 'text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <LinkIcon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/60 flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-cyan text-xs">
                LNN
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate">Nagar Nigam Admin</span>
                <span className="text-[10px] text-slate-400 font-medium">Lucknow, UP</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-brand-cyan text-xs mx-auto">
              LNN
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky Top Navbar */}
        <header className="h-16 border-b border-slate-800/60 bg-[#070b13]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Quick Search bar */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 transition-all text-xs w-48 sm:w-64"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search complaint tickets...</span>
            </button>
          </div>

          {/* Right Header Status Controls */}
          <div className="flex items-center gap-4">
            {/* AI Health Pulse Indicator */}
            <div className="hidden lg:flex items-center gap-2 bg-[#080d17] border border-slate-800 px-3 py-1 rounded-lg">
              <Cpu className="w-3.5 h-3.5 text-brand-indigo" />
              <div className="flex flex-col text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-slate-300">AI Core Latency</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="font-mono text-brand-cyan font-bold">{telemetry.averageLatencyMs}ms / {telemetry.cpuUsage}% CPU</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-40 p-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <span className="font-display font-bold text-xs uppercase text-slate-300 tracking-wider">Alert Center</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-[10px] text-brand-cyan hover:underline font-semibold">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto scrollbar-thin">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            className={`p-2.5 rounded-lg border text-xs flex gap-2 ${
                              notif.read ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' : 'bg-slate-800/30 border-slate-700/60 text-slate-200'
                            }`}
                          >
                            <span className="mt-0.5">
                              {notif.type === 'escalation' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              ) : notif.type === 'resolved' ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <HelpCircle className="w-3.5 h-3.5 text-brand-cyan" />
                              )}
                            </span>
                            <div className="flex-1 leading-snug">{notif.text}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Scroll Container */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modal - Universal Quick Command search */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-10"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 p-4 border-b border-slate-800">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type a ticket ID (e.g. JM-2026-9821) and press enter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-100 text-sm flex-1 placeholder-slate-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              <div className="p-3 bg-slate-950/50 text-[10px] text-slate-500 flex justify-between font-semibold">
                <span>PRESS ESC TO CLOSE</span>
                <span>ENTER TO SEARCH</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
