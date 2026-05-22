import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Map, 
  TrendingUp, 
  Cpu,
  Shield,
  Settings,
  Edit,
  Play
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { GlassCard } from '../components/ui/GlassCard';
import { CustomModal } from '../components/ui/CustomModal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { DeptTag } from '../components/ui/DeptTag';
import { dashboardService } from '../services/dashboardService';
import { complaintService } from '../services/complaintService';
import { 
  AreaChart, 
  Area, 
  RadialBarChart, 
  RadialBar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const AdminDashboard = () => {
  const { addToast } = useToast();
  
  // Dashboard Metrics & Tables States
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, escalated: 0, slaCompliance: 92, governanceHealth: 90 });
  const [departments, setDepartments] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [chartData, setChartData] = useState({ trends: [], confidenceDist: [], categoryData: [] });
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Heatmap focus state
  const [activeArea, setActiveArea] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const s = await dashboardService.getStats();
      const d = await dashboardService.getDepartmentStats();
      const h = await dashboardService.getHeatmapData();
      const c = await dashboardService.getAnalyticsCharts();
      const list = await complaintService.list();
      
      setStats(s);
      setDepartments(d);
      setHeatmap(h);
      setChartData(c);
      setComplaints(list);
    } catch {
      addToast('Error loading administrative telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdateStatus = async (status) => {
    if (!selectedComplaint) return;
    try {
      await complaintService.updateStatus(selectedComplaint.id, status, adminNote);
      addToast(`Ticket ${selectedComplaint.id} updated to ${status}.`, 'success');
      setActionModalOpen(false);
      setAdminNote('');
      setSelectedComplaint(null);
      fetchDashboardData(); // Refresh list
    } catch {
      addToast('Failed to write changes to ledger.', 'error');
    }
  };

  // Pie chart colors
  const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* Dashboard Title & Clock */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">LKO City Operating System</span>
          <h1 className="font-display font-bold text-3xl text-slate-100 mt-1 uppercase tracking-wide">
            Governance Command Room
          </h1>
        </div>
        <div className="bg-[#090d16] border border-slate-800 px-4 py-2 rounded-lg text-right font-mono text-xs text-slate-400">
          <div>LEDGER NODE: <span className="text-emerald-400 font-bold">ONLINE</span></div>
          <div className="text-[10px] mt-0.5 text-slate-500">CYCLE REFRESH: 6S INTERVAL</div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-500 w-full">
          <Cpu className="w-10 h-10 text-brand-cyan animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase">Booting Command telemetry grids...</span>
        </div>
      ) : (
        <>
          {/* 1. KPIs Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <GlassCard className="p-5 flex items-center justify-between border-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Total Pipeline Cases</span>
                <span className="text-3xl font-display font-bold text-slate-100">{stats.total}</span>
              </div>
              <div className="p-3 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center justify-between border-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Active Grievances</span>
                <span className="text-3xl font-display font-bold text-brand-cyan">{stats.pending}</span>
              </div>
              <div className="p-3 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shrink-0">
                <Clock className="w-5 h-5" />
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center justify-between border-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Resolved Cases</span>
                <span className="text-3xl font-display font-bold text-emerald-400">{stats.resolved}</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
            </GlassCard>

            <GlassCard className="p-5 flex items-center justify-between border-slate-800">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">SLA Breach Threats</span>
                <span className="text-3xl font-display font-bold text-rose-500">{stats.escalated}</span>
              </div>
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </GlassCard>
          </div>

          {/* 2. Secondary Metrics: Health score donut, Response velocity, heatmaps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health indicators */}
            <GlassCard className="lg:col-span-1 p-5 flex flex-col justify-between border-brand-indigo/15">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-4">
                <Activity className="w-4 h-4 text-brand-indigo" />
                Governance Index
              </span>

              <div className="flex flex-col items-center gap-4">
                {/* Radial progress for Health score */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="80%" 
                      outerRadius="100%" 
                      barSize={12} 
                      data={[{ name: 'Health', value: stats.governanceHealth, fill: '#6366f1' }]}
                    >
                      <RadialBar minAngle={15} background clockWise dataKey="value" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-display font-bold text-slate-100">{stats.governanceHealth}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Health score</span>
                  </div>
                </div>

                <div className="w-full flex justify-around text-center mt-2 border-t border-slate-800 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">SLA COMPLIANCE</span>
                    <span className="text-sm font-semibold text-brand-cyan font-mono mt-0.5">{stats.slaCompliance}%</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">CITIZEN RATINGS</span>
                    <span className="text-sm font-semibold text-brand-violet font-mono mt-0.5">{stats.satisfactionAverage} / 5</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Smart Heatmap UI */}
            <GlassCard className="lg:col-span-2 p-5 border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Map className="w-4 h-4 text-brand-cyan" />
                  Spatial Incident Density
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Lucknow Hotspots</span>
              </div>

              {/* Graphic map representation of ward zones */}
              <div className="relative h-48 w-full bg-slate-950/60 rounded-xl border border-slate-850 overflow-hidden flex items-center justify-center p-4">
                {/* Simulated Radar vector lines grid */}
                <div className="absolute inset-0 radar-grid opacity-15 pointer-events-none" />
                
                {/* Hotspot coordinate bubbles */}
                {heatmap.map((area) => (
                  <button
                    key={area.name}
                    onClick={() => setActiveArea(activeArea?.name === area.name ? null : area)}
                    className="absolute group transition-transform hover:scale-110"
                    style={{
                      left: `${((area.longitude - 80.89) / 0.12) * 100}%`,
                      top: `${(100 - ((area.latitude - 26.83) / 0.075) * 100)}%`,
                    }}
                  >
                    {/* Glowing ring */}
                    <span className="absolute inset-0 w-6 h-6 rounded-full bg-rose-500/20 animate-ping group-hover:bg-rose-500/35" />
                    <span 
                      className="relative block w-3.5 h-3.5 rounded-full border border-slate-900 shadow-lg cursor-pointer"
                      style={{ backgroundColor: area.weight > 80 ? '#f43f5e' : '#f59e0b' }}
                    />
                  </button>
                ))}

                {/* Active hotspot stats tag */}
                <AnimatePresence>
                  {activeArea && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 5 }}
                      className="absolute bottom-4 right-4 bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs font-mono z-15 shadow-2xl flex flex-col gap-1 text-left"
                    >
                      <span className="font-bold text-slate-200 uppercase">{activeArea.name}</span>
                      <span className="text-[10px] text-slate-400">INCIDENTS: <strong className="text-brand-cyan">{activeArea.complaints}</strong></span>
                      <span className="text-[10px] text-slate-400">DENSITY: <strong className="text-rose-400">{activeArea.weight}% Critical</strong></span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase flex flex-col gap-0.5">
                  <span>SCALE: Municipal Grid</span>
                  <span>CENTER: Gomti river node</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* 3. Recharts graphs area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trends Chart */}
            <GlassCard className="lg:col-span-2 p-5 border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-4">
                <TrendingUp className="w-4 h-4 text-brand-cyan" />
                Pipeline Volume Trends
              </span>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.trends}>
                    <defs>
                      <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="resolvedColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #334155', color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Area type="monotone" name="Total Inflow" dataKey="total" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColor)" />
                    <Area type="monotone" name="Resolved" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#resolvedColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Category Pie Chart */}
            <GlassCard className="lg:col-span-1 p-5 border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5 mb-4">
                <Shield className="w-4 h-4 text-brand-indigo" />
                Incident Distribution
              </span>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#090d16', border: '1px solid #334155', fontSize: '10px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* 4. Live Complaint Ticker & Department Performance Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Feed ticker */}
            <GlassCard className="lg:col-span-2 p-5 border-slate-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-brand-cyan animate-pulse" />
                  Live Grievance Operations
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{complaints.length} tickets ledgered</span>
              </div>

              {/* Feed lists */}
              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto scrollbar-thin">
                {complaints.map((c) => (
                  <div 
                    key={c.id}
                    className="p-4 bg-slate-900/50 border border-slate-850/60 rounded-xl hover:border-slate-700/60 transition-all flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-brand-cyan text-xs">{c.id}</span>
                        <DeptTag department={c.aiAnalysis.department} />
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge type="priority" value={c.aiAnalysis.urgency} />
                        <StatusBadge type="status" value={c.status} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-slate-200 leading-snug">{c.title}</span>
                      <p className="text-[10px] text-slate-400 truncate">{c.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-850 pt-2 text-[10px] text-slate-500 font-mono">
                      <span>FILED: {new Date(c.submittedAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setActionModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[9px] font-bold uppercase tracking-wider text-brand-cyan hover:bg-slate-800 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Execute Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Department Table */}
            <GlassCard className="lg:col-span-1 p-5 border-slate-800 flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-brand-indigo" />
                Department Response Velocities
              </span>

              <div className="flex flex-col gap-3 max-h-96 overflow-y-auto scrollbar-thin">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-3 bg-slate-900/40 border border-slate-850 rounded-lg flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-slate-200 truncate">{dept.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono mt-0.5">{dept.officer}</span>
                      </div>
                      <span className="text-xs font-bold text-brand-cyan font-mono">{dept.responseVelocity}</span>
                    </div>

                    {/* Progress velocity indicator */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>THROUGHPUT</span>
                        <span>{dept.throughput}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-indigo rounded-full" 
                          style={{ width: `${dept.throughput}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Action Modals */}
          {selectedComplaint && (
            <CustomModal
              isOpen={actionModalOpen}
              onClose={() => setActionModalOpen(false)}
              title={`Execute Action - Ticket ${selectedComplaint.id}`}
              maxWidth="max-w-md"
            >
              <div className="flex flex-col gap-4 text-left font-sans">
                <div className="flex flex-col gap-1 p-3 bg-slate-950 rounded-lg border border-slate-850">
                  <span className="text-[9px] uppercase font-bold text-slate-500">Incident Details</span>
                  <span className="text-xs text-slate-300 font-semibold truncate mt-0.5">{selectedComplaint.title}</span>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{selectedComplaint.description}</p>
                </div>

                {/* Text comment form */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Department dispatch / update note
                  </label>
                  <textarea
                    placeholder="Provide details on crew status or resolution parameters..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    className="px-3 py-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:border-brand-cyan outline-none transition-colors scrollbar-thin resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    className="w-full py-2.5 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] text-xs font-bold uppercase tracking-wider text-slate-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Dispatch crew (Mark In Progress)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Resolved')}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-550 text-xs font-bold uppercase tracking-wider text-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolve ticket (Mark Resolved)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('Escalated')}
                    className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-550 text-xs font-bold uppercase tracking-wider text-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Trigger SLA Escalation
                  </button>
                </div>
              </div>
            </CustomModal>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
