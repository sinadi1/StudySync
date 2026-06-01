import React from 'react';

export default function OverviewView({ userData, analyticsData }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-2">Welcome to your Workspace, {userData ? userData.name : 'Learner'}! 🚀</h3>
        <p className="text-slate-400 max-w-2xl">Your profile details have been successfully pulled straight from your MongoDB cloud database cluster.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Subjects</span>
          <div className="text-2xl font-bold text-white mt-1">{analyticsData.totalSubjects}</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completed Tasks</span>
          <div className="text-2xl font-bold text-white mt-1">{analyticsData.taskCompletionRate}%</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Study Hours</span>
          <div className="text-2xl font-bold text-white mt-1">{analyticsData.totalHours} hrs</div>
        </div>
      </div>
    </div>
  );
}