import React from 'react';

export default function AnalyticsView({ analyticsData }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xl font-bold text-white mb-4">Task Execution Metric</h3>
        <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
            style={{ width: `${analyticsData.taskCompletionRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-slate-400 mt-2">
          You have finished <span className="text-cyan-400 font-semibold">{analyticsData.completedTasks}</span> out of <span className="text-slate-200 font-semibold">{analyticsData.totalTasks}</span> assigned check-items.
        </p>
      </div>
    </div>
  );
}