import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Upload, 
  Mic, 
  Sparkles, 
  Cpu, 
  CheckCircle,
  Clock, 
  Volume2,
  Copy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import { GlassCard } from '../components/ui/GlassCard';
import { CustomModal } from '../components/ui/CustomModal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfidenceMeter } from '../components/ui/ConfidenceMeter';
import { complaintService, analyzeComplaintText } from '../services/complaintService';

export const ComplaintSubmission = () => {
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('Gomti Nagar');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const areasList = [
    'Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Charbagh', 'Chowk', 'Aminabad', 'Jankipuram'
  ];

  // Derive AI Predictions on description change
  const aiPreview = (description.length > 10 || title.length > 5)
    ? analyzeComplaintText(title, description)
    : null;

  // Voice complaint injection script
  const triggerVoiceComplaint = () => {
    setIsRecording(true);
    addToast('Simulating voice capture engine...', 'info');

    // Simulate 3 seconds recording
    setTimeout(() => {
      setIsRecording(false);
      setName('Manoj Dwivedi');
      setPhone('+91 95112 00384');
      setArea('Hazratganj');
      setTitle('Transformer fire hazard near market');
      setDescription('There is heavy sparks coming out of the transformer in Hazratganj near high pedestrian retail area. Please send LESA team immediately before the wires collapse.');
      addToast('Voice parsed via NLP Translation!', 'success');
      setStep(2); // Jump directly to description detail check
    }, 3500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Simulate URL generation
      setImageUrl(URL.createObjectURL(file));
      addToast('Attachment scanned for metadata.', 'info');
    }
  };

  const validateStep = () => {
    if (step === 1) {
      if (!name.trim()) return addToast('Please enter your name.', 'warning');
      if (!phone.trim()) return addToast('Please enter your phone number.', 'warning');
      setStep(2);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      return addToast('Please input title and grievance description.', 'warning');
    }

    setLoading(true);
    try {
      const payload = {
        name,
        phone,
        area,
        title,
        description,
        imageUrl
      };
      const response = await complaintService.submit(payload);
      setCreatedTicket(response);
      setSuccessModalOpen(true);
      addToast('Grievance logged in municipal ledger.', 'success');
      
      // Clear form
      setName('');
      setPhone('');
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImageUrl('');
      setStep(1);
    } catch {
      addToast('Failed to connect to gateway.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyTicketId = () => {
    if (createdTicket) {
      navigator.clipboard.writeText(createdTicket.id);
      addToast('Ticket ID copied to clipboard.', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 text-left">
        <div>
          <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">Citizen Portal Gateway</span>
          <h1 className="font-display font-bold text-3xl text-slate-100 mt-1 uppercase tracking-wide">
            File Municipal Grievance
          </h1>
        </div>

        {/* Mock voice button */}
        <button
          onClick={triggerVoiceComplaint}
          disabled={isRecording}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isRecording 
              ? 'bg-rose-500/25 text-rose-400 border-rose-500/40 animate-pulse' 
              : 'bg-slate-900 border-slate-800 text-brand-cyan hover:border-brand-cyan/40 shadow-md'
          }`}
        >
          {isRecording ? (
            <>
              <Volume2 className="w-4 h-4 animate-bounce" />
              Listening...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              File via Voice (Mock)
            </>
          )}
        </button>
      </div>

      {/* Voice Waveform animation overlay */}
      {isRecording && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4"
        >
          <Mic className="w-12 h-12 text-brand-cyan animate-pulse" />
          <span className="text-sm font-semibold font-mono tracking-widest text-slate-300 uppercase">AI Speech Engine Listening</span>
          <div className="flex items-center gap-1 h-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <motion.div
                key={i}
                className="w-1.5 bg-brand-cyan rounded-full"
                animate={{ height: [8, ((i * 7 + 13) % 24) + 8, 8] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 font-medium">Say: "Transformer fire hazard Halwasiya Market Hazratganj..."</span>
        </motion.div>
      )}

      {/* Grid container: Wizard on left, Live AI Preview card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <GlassCard className="p-6 md:p-8">
            {/* Step indicators */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                  step >= 1 ? 'bg-brand-cyan text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>1</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step >= 1 ? 'text-slate-200' : 'text-slate-500'
                }`}>CONTACT DETAILS</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                  step === 2 ? 'bg-brand-cyan text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>2</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  step === 2 ? 'text-slate-200' : 'text-slate-500'
                }`}>GRIEVANCE DETAILS</span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 text-left">
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-cyan" />
                      Citizen Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Phone field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-brand-cyan" />
                      Citizen Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Area field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-cyan" />
                      Municipal Area / ward (Lucknow)
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors cursor-pointer"
                    >
                      {areasList.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  {/* Next button */}
                  <button
                    type="button"
                    onClick={validateStep}
                    className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-bold uppercase tracking-wider text-slate-100 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    Continue to details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  {/* Title field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                      Complaint Title
                    </label>
                    <input
                      type="text"
                      placeholder="Briefly state the issue (e.g. Sewage water leaking)"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors"
                      required
                    />
                  </div>

                  {/* Description field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-brand-cyan" />
                      Grievance Description (Try typing 'live electrical wires hanging' or 'garbage heap')
                    </label>
                    <textarea
                      placeholder="Provide full description of the issue including specific streets, milestones, and how long it has been present..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="px-4 py-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-brand-cyan outline-none transition-colors scrollbar-thin resize-none"
                      required
                    />
                  </div>

                  {/* Upload Image Drop-zone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-brand-cyan" />
                      Attach Evidence Photo (Optional)
                    </label>
                    <div className="border border-dashed border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-slate-700 transition-colors cursor-pointer relative bg-slate-950/20">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {imageFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="w-8 h-8 text-emerald-400" />
                          <span className="text-xs text-slate-300 font-semibold">{imageFile.name}</span>
                          <span className="text-[10px] text-slate-500">Click or drag another image to replace</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-600" />
                          <span className="text-xs text-slate-400 font-semibold">Drag files here or click to upload</span>
                          <span className="text-[10px] text-slate-600">Supports JPG, PNG (Max 5MB)</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-violet text-xs font-bold uppercase tracking-wider text-slate-100 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-all flex-1 flex items-center justify-center gap-1.5 shadow-lg disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Cpu className="w-4 h-4 animate-spin" />
                          Executing ledger record...
                        </>
                      ) : (
                        <>
                          Submit Grievance
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </GlassCard>
        </div>

        {/* Real-time AI Predictions panel on right */}
        <div className="lg:col-span-1 flex flex-col gap-6 text-left">
          <GlassCard className="p-5 border-brand-indigo/20 flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-widest text-brand-cyan font-extrabold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Cognitive Engine Analyzer
            </span>
            <div className="h-[1px] bg-slate-800" />

            <AnimatePresence mode="wait">
              {aiPreview ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col gap-4 font-sans"
                >
                  <ConfidenceMeter value={aiPreview.ai_confidence_score} />
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Predicted Category</span>
                    <span className="text-sm font-semibold text-slate-200 leading-snug">{aiPreview.category}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Target Department</span>
                    <span className="text-sm font-semibold text-brand-cyan leading-snug">{aiPreview.department}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Urgency Level</span>
                      <StatusBadge type="priority" value={aiPreview.urgency} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Priority Score</span>
                      <span className="text-lg font-bold font-mono text-slate-200">{aiPreview.priority_score} / 100</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                    <div className="flex items-center gap-1 text-[10px] text-brand-indigo font-bold uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      Resolution Forecast
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      Assigned SLA is **{aiPreview.ticket_sla_days} Days** based on automated priority thresholds.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center gap-3 text-slate-500"
                >
                  <Cpu className="w-8 h-8 text-slate-700 animate-pulse" />
                  <p className="text-xs leading-relaxed max-w-[200px]">
                    Fill in the title and description to activate real-time cognitive parsing previews.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>

      {/* Success Modal */}
      {createdTicket && (
        <CustomModal
          isOpen={successModalOpen}
          onClose={() => setSuccessModalOpen(false)}
          title="Grievance Registered"
          maxWidth="max-w-xl"
        >
          <div className="flex flex-col gap-5 text-left font-sans">
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">AI routing successful</span>
                <span className="text-xs text-slate-300 leading-snug">
                  Complaint matched with **{createdTicket.aiAnalysis.ai_confidence_score}%** precision.
                </span>
              </div>
            </div>

            {/* Ticket Credentials */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Ticket Track ID</span>
                <span className="text-xl font-mono font-bold text-brand-cyan">{createdTicket.id}</span>
              </div>
              <button
                onClick={copyTicketId}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy Ticket ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Routed Department</span>
                <span className="text-xs font-semibold text-slate-200 truncate">{createdTicket.aiAnalysis.department}</span>
              </div>
              <div className="flex flex-col gap-1.5 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500">Urgency Classification</span>
                <StatusBadge type="priority" value={createdTicket.aiAnalysis.urgency} />
              </div>
            </div>

            {/* Hindi translations & SMS Preview */}
            <div className="flex flex-col gap-2 p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl font-mono text-[10px] text-slate-400 leading-relaxed">
              <span className="font-sans font-bold text-slate-300 uppercase">System Dispatch SMS</span>
              <p className="bg-slate-950 p-2.5 rounded border border-slate-850 text-brand-cyan">
                {createdTicket.aiAnalysis.sms_hi}
              </p>
            </div>

            <button
              onClick={() => setSuccessModalOpen(false)}
              className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors mt-2"
            >
              Close wizard
            </button>
          </div>
        </CustomModal>
      )}
    </div>
  );
};

export default ComplaintSubmission;
