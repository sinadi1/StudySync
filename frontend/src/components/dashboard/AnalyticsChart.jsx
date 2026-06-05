import React from 'react';
import { BarChart2 } from 'lucide-react';

export default function AnalyticsChart({ subjects = [] }) {
  const maxHours = Math.max(...subjects.map(s => s.hoursStudied || 0), 1);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
      <div className="flex items-center gap-2">
        <BarChart2 className="h-4 w-4 text-cyan-400" />
        <div>
          <h4 className="text-sm font-bold text-white">Subject Time Allocation</h4>
          <p className="text-xs text-slate-500">Comparative breakdown of your invested study hours</p>
        </div>
      </div>

      {subjects.length === 0 ? (
        <p className="text-xs text-slate-600 italic py-4 text-center">No subject metrics available yet</p>
      ) : (
        <div className="space-y-4">
          {subjects.map((subj) => {
            const percentage = ((subj.hoursStudied || 0) / maxHours) * 100;
            return (
              <div key={subj._id} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300 truncate max-w-[70%]">{subj.name}</span>
                  <span className="text-cyan-400">{subj.hoursStudied || 0} hrs</span>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60">
                  <div
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}