import React from 'react';

export default function ActivityHeatmap({ activeDates = [] }) {
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
      <div>
        <h4 className="text-sm font-bold text-white">Consistency Matrix</h4>
        <p className="text-xs text-slate-500">Your daily learning activity map over the last 5 weeks</p>
      </div>

      <div className="flex flex-wrap gap-2 max-w-full">
        {days.map((dateStr) => {
          const isActive = activeDates.includes(dateStr);
          return (
            <div
              key={dateStr}
              title={dateStr}
              className={`w-5 h-5 rounded-md transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-sm shadow-cyan-500/20 scale-105' 
                  : 'bg-slate-800 border border-slate-700/50'
              }`}
            />
          );
        })}
      </div>
      
      <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-slate-500 pt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700/50" />
          <span>Rest Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-cyan-500 to-emerald-500" />
          <span>Active Session</span>
        </div>
      </div>
    </div>
  );
}