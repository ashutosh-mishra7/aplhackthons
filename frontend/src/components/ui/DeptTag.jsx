import { Bolt, Droplet, Trash2, ShieldAlert, Navigation, Settings } from 'lucide-react';

export const DeptTag = ({ department = '' }) => {
  const normDept = department.toLowerCase();
  
  let code = 'GOV';
  let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <Settings className="w-3.5 h-3.5" />;
  
  if (normDept.includes('electricity') || normDept.includes('lesa') || normDept.includes('vidyut') || normDept.includes('power')) {
    code = 'LESA-PWR';
    colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    icon = <Bolt className="w-3.5 h-3.5" />;
  } else if (normDept.includes('water') || normDept.includes('jal') || normDept.includes('sewer') || normDept.includes('drainage')) {
    code = 'JAL-SAN';
    colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    icon = <Droplet className="w-3.5 h-3.5" />;
  } else if (normDept.includes('sanitation') || normDept.includes('nagar nigam') || normDept.includes('garbage')) {
    code = 'LNN-SAN';
    colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    icon = <Trash2 className="w-3.5 h-3.5" />;
  } else if (normDept.includes('traffic')) {
    code = 'LKO-TRF';
    colorClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    icon = <Navigation className="w-3.5 h-3.5" />;
  } else if (normDept.includes('encroachment') || normDept.includes('town planning') || normDept.includes('rajasva') || normDept.includes('land')) {
    code = 'LNN-ENC';
    colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    icon = <ShieldAlert className="w-3.5 h-3.5" />;
  } else if (normDept.includes('public works') || normDept.includes('pwd') || normDept.includes('loknirman') || normDept.includes('road')) {
    code = 'PWD-INF';
    colorClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-semibold ${colorClass}`}>
      {icon}
      <span>{code}</span>
      <span className="text-[10px] opacity-60 font-normal hidden sm:inline">| {department}</span>
    </div>
  );
};

export default DeptTag;
