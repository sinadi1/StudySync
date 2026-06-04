import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-950 border-emerald-800 text-emerald-400',
    error: 'bg-rose-950 border-rose-800 text-rose-400',
    info: 'bg-cyan-950 border-cyan-800 text-cyan-400'
  };

  const icons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slideIn min-w-[280px] max-w-sm ${styles[type]}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-xs font-semibold flex-1 leading-relaxed">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xs p-0.5">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}