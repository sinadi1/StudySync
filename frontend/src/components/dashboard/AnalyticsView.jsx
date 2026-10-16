import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart2, Clock, CheckCircle2, BookOpen, Calendar } from 'lucide-react';

export default function AnalyticsView({ token, analyticsData, onRangeChange }) {
  const [activeRange, setActiveRange] = useState('all');
  const [data, setData] = useState(analyticsData || { totalSubjects: 0, totalHours: 0, totalTasks: 0, completedTasks: 0, taskCompletionRate: 0 });
  const [loading, setLoading] = useState(false);

  const fetchRangeAnalytics = async (range) => {
    setActiveRange(range);
    setLoading(true);
    try {
      if (onRangeChange) {
        await onRangeChange(range);
      } else {
        const query = range !== 'all' ? `?range=${range}` : '';
        const res = await axios.get(`http://localhost:5000/api/analytics${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.success) {
          setData(res.data.analytics);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const ranges = [
    { label: '7 Days', value: '7' },
    { label: '30 Days', value: '30' },
    { label: 'All Time', value: 'all' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-cyan-400" />
            Performance Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track your consistency and task velocity across time ranges</p>
        </div>

        {/* Range Selector Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => fetchRangeAnalytics(r.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeRange === r.value
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Hours Studied</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.totalHours || 0} hrs</h3>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Subjects</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.totalSubjects || 0}</h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Completed Tasks</p>
            <h3 className="text-2xl font-bold text-white mt-1">{data.completedTasks || 0} / {data.totalTasks || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Task Completion Rate</p>
            <h3 className="text-2xl font-bold text-cyan-400 mt-1">{data.taskCompletionRate || 0}%</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}