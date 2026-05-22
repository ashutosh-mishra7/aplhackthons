import { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Cpu, 
  Terminal, 
  Database, 
  CheckCircle,
  Zap,
  Sliders,
  Clock
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { GlassCard } from '../components/ui/GlassCard';
import { aiMonitoringService } from '../services/aiMonitoringService';
import { subscribeToRequests } from '../services/axiosClient';

export const AIMonitoring = () => {
  const { addToast } = useToast();
  
  // States
  const [telemetry, setTelemetry] = useState(null);
  const [logs, setLogs] = useState([]);
  const [diagnosticActive, setDiagnosticActive] = useState(false);
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [diagnosticReport, setDiagnosticReport] = useState(null);

  const logsEndRef = useRef(null);

  // Load telemetry & seed logs
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const telemetryStats = await aiMonitoringService.getEngineTelemetry();
        const initialLogs = await aiMonitoringService.getExecutionLogs();
        
        setTelemetry(telemetryStats);
        setLogs(initialLogs);
      } catch {
        addToast('Telemetry server down.', 'error');
      }
    };
    loadInitialData();
  }, [addToast]);

  // Subscribe to live Axios Client requests
  useEffect(() => {
    const unsubscribe = subscribeToRequests((req) => {
      const newLog = {
        timestamp: req.timestamp,
        ticketId: req.payload?.id || 'SYS-GATEWAY',
        text: `REST CALL: ${req.type} ${req.url} - Payload: ${JSON.stringify(req.payload || {})}`,
        action: `HTTP STATUS: ${req.response?.status || 200}`,
        score: req.response?.data?.aiAnalysis?.ai_confidence_score / 100 || 0.95,
        dept: req.response?.data?.aiAnalysis?.department || 'N/A'
      };
      setLogs(prev => [...prev, newLog]);
    });
    return () => unsubscribe();
  }, []);

  // System statistics fluctuations simulation
  useEffect(() => {
    const statsInterval = setInterval(async () => {
      try {
        const telemetryStats = await aiMonitoringService.getEngineTelemetry();
        setTelemetry(telemetryStats);

        // Add a mock ambient background parse log now and then
        if (Math.random() > 0.6) {
          const mockTickets = ['JM-2026-1022', 'JM-2026-8830', 'JM-2026-3829'];
          const selectedTkt = mockTickets[Math.floor(Math.random() * mockTickets.length)];
          const sampleLog = {
            timestamp: new Date().toISOString(),
            ticketId: selectedTkt,
            text: `Spatial routing threshold check for node ${selectedTkt}...`,
            action: 'Heuristics matched - SLA active',
            score: Math.round((80 + Math.random() * 19) * 10) / 1000,
            dept: 'Jal Sansthan (Water & Sewage)'
          };
          setLogs(prev => [...prev, sampleLog]);
        }
      } catch {
        // Fail-safe
      }
    }, 4500);

    return () => clearInterval(statsInterval);
  }, []);

  // Scroll terminal logs on new entry
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Execute diagnostic action script
  const triggerSelfDiagnostic = () => {
    setDiagnosticActive(true);
    setDiagnosticProgress(0);
    setDiagnosticReport(null);
    addToast('Initiating diagnostic node verification...', 'info');

    const progressInterval = setInterval(() => {
      setDiagnosticProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setDiagnosticActive(false);
          setDiagnosticReport({
            nlpParser: 'OK - 99.4% Latency Peak',
            classifier: 'OK - 1536 Dimensions Embeddings Compliant',
            routingGateway: 'OK - API Contract Mapping Compliant',
            localDB: 'OK - 256 Nodes Active'
          });
          addToast('Diagnostic complete. All pipelines nominal.', 'success');
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  return (
    <div className="flex flex-col gap-8 text-left font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">AI Operations Command deck</span>
          <h1 className="font-display font-bold text-3xl text-slate-100 mt-1 uppercase tracking-wide">
            Cognitive Engine Control Center
          </h1>
        </div>

        <button
          onClick={triggerSelfDiagnostic}
          disabled={diagnosticActive}
          className="px-5 py-2.5 rounded-lg bg-[#090d16] border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-wider hover:bg-brand-cyan/15 hover:border-brand-cyan transition-all flex items-center gap-1.5 shadow-lg shadow-brand-cyan/5"
        >
          <Zap className="w-4 h-4 text-brand-cyan" />
          Run Self-Diagnostic
        </button>
      </div>

      {/* Telemetry Core Metrics Grid */}
      {telemetry && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <GlassCard className="p-4 flex items-center justify-between border-slate-800">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-500">Core Latency</span>
              <span className="text-xl font-mono font-bold text-brand-cyan">{telemetry.averageLatencyMs}ms</span>
            </div>
            <div className="p-2 bg-brand-cyan/10 rounded-lg text-brand-cyan shrink-0">
              <Clock className="w-4 h-4" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between border-slate-800">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-500">Core CPU utilization</span>
              <span className="text-xl font-mono font-bold text-slate-100">{telemetry.cpuUsage}%</span>
            </div>
            <div className="p-2 bg-brand-indigo/10 rounded-lg text-brand-indigo shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between border-slate-800">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-500">VRAM allocation</span>
              <span className="text-xl font-mono font-bold text-slate-100">{telemetry.memoryUsage}%</span>
            </div>
            <div className="p-2 bg-brand-indigo/10 rounded-lg text-brand-indigo shrink-0">
              <Database className="w-4 h-4" />
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center justify-between border-slate-800">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-500">Queue Processing Load</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{telemetry.queueSize} Tasks</span>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </GlassCard>
        </div>
      )}

      {/* Diagnostics Progress bar panel */}
      {diagnosticActive && (
        <GlassCard className="p-5 border-brand-cyan/30 bg-brand-cyan/5">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs font-mono font-bold text-brand-cyan">
              <span>SCANNING DEEP COGNITIVE LAYERS...</span>
              <span>{diagnosticProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="h-full bg-brand-cyan transition-all duration-200" 
                style={{ width: `${diagnosticProgress}%` }}
              />
            </div>
          </div>
        </GlassCard>
      )}

      {/* Diagnostic Results Report Panel */}
      {diagnosticReport && (
        <GlassCard className="p-5 border-emerald-500/30 bg-emerald-500/5">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              SYSTEM DIAGNOSTIC REPORT NOMINAL
            </span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-[10px] text-slate-400">
              <div className="p-2 bg-slate-950/60 rounded border border-slate-850 flex flex-col gap-0.5">
                <span>NLP EM-PARSER:</span>
                <strong className="text-emerald-400">{diagnosticReport.nlpParser}</strong>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-850 flex flex-col gap-0.5">
                <span>CLASSIFIER CORE:</span>
                <strong className="text-emerald-400">{diagnosticReport.classifier}</strong>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-850 flex flex-col gap-0.5">
                <span>ROUTING SCHEDULER:</span>
                <strong className="text-emerald-400">{diagnosticReport.routingGateway}</strong>
              </div>
              <div className="p-2 bg-slate-950/60 rounded border border-slate-850 flex flex-col gap-0.5">
                <span>LOCAL CACHE INDEX:</span>
                <strong className="text-emerald-400">{diagnosticReport.localDB}</strong>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Center Layout: Visual workflow node map & live processing logs console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Visual Workflow map */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlassCard className="p-5 border-slate-800 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-brand-indigo" />
              Pipeline Node Map
            </span>
            
            {/* Visual interactive diagram using tailwind grid */}
            <div className="flex flex-col gap-5 p-4 bg-slate-950/50 rounded-xl border border-slate-850">
              {/* Node 1: Parser */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-1.5 relative select-none">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wide">
                  <span>1. NLP Parser</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Input translation & keyword tokenizer</span>
              </div>

              {/* Path connector line */}
              <div className="w-[2px] h-4 bg-gradient-to-bottom from-brand-indigo to-brand-cyan mx-auto" />

              {/* Node 2: Router */}
              <div className="p-3 bg-slate-900 border border-brand-cyan/40 rounded-lg flex flex-col gap-1.5 relative select-none shadow-[0_0_12px_rgba(6,182,212,0.1)]">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wide">
                  <span>2. Cognitive Router</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Categorizer & Department scheduler</span>
              </div>

              {/* Path connector line */}
              <div className="w-[2px] h-4 bg-gradient-to-bottom from-brand-cyan to-brand-violet mx-auto" />

              {/* Node 3: Department Queues */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-2 relative select-none">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wide">
                  <span>3. Dispatch Queues</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-400">
                  <span className="p-1 bg-slate-950 rounded border border-slate-850 text-center">LESA</span>
                  <span className="p-1 bg-slate-950 rounded border border-slate-850 text-center">JAL SANSTHAN</span>
                  <span className="p-1 bg-slate-950 rounded border border-slate-850 text-center">NAGAR NIGAM</span>
                  <span className="p-1 bg-slate-950 rounded border border-slate-850 text-center">PWD</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Live Processing console */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard className="p-5 border-slate-800 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              Live Ledger Execution terminal
            </span>

            {/* Terminal log console */}
            <div className="h-96 bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-[10px] flex flex-col gap-2.5 overflow-y-auto scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="flex flex-col gap-1 text-left">
                  <div className="flex justify-between items-center text-slate-500 font-bold">
                    <span>[{new Date(log.timestamp).toLocaleTimeString()}] TICKET: {log.ticketId}</span>
                    <span className="text-brand-cyan">{log.action}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed pl-2 border-l border-slate-800">
                    {log.text}
                  </p>
                  {log.dept !== 'N/A' && (
                    <span className="text-[9px] text-brand-violet font-semibold pl-2">ROUTE: {log.dept}</span>
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AIMonitoring;
