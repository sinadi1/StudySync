import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';

export default function AnalyticsView({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to load metrics platform layout", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return <div className="text-center text-slate-500 text-sm py-12">Generating data visualization streams...</div>;
  }

  const taskRate = stats?.taskCompletionRate || 0;
  const totalSubj = stats?.totalSubjects || 0;
  const completedSubj = stats?.completedSubjects || 0;
  const openSubj = totalSubj - completedSubj;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Performance Metrics</h3>
          <p className="text-xs text-slate-500">Deep-dive visual analysis of your academic study distribution profiles.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-cyan-400" /> Real-Time Sync
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-300">Task Velocity</h4>
              <p className="text-[11px] text-slate-500">Ratio of tasks cleared vs remaining backlog</p>
            </div>
            <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400"><TrendingUp className="h-4 w-4" /></div>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-inner">
              <span className="text-xl font-black text-white">{taskRate}%</span>
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-pulse" />
            </div>
          </div>
          <div className="text-[11px] text-center text-slate-400 font-medium">
            Currently holding a <span className="text-cyan-400 font-bold">{taskRate > 70 ? 'High' : 'Moderate'}</span> execution rate.
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 md:col-span-2 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-bold text-slate-300">Subject Track Breakdowns</h4>
              <p className="text-[11px] text-slate-500">Comparative density allocation of active learning workflows</p>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400"><BarChart3 className="h-4 w-4" /></div>
          </div>

          <div className="space-y-4 py-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                <span>Completed Core Targets</span>
                <span className="text-emerald-400">{completedSubj} tracks</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalSubj > 0 ? (completedSubj / totalSubj) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
                <span>In-Progress Queue Volume</span>
                <span className="text-amber-400">{openSubj} tracks</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalSubj > 0 ? (openSubj / totalSubj) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between items-center">
            <span>Total Core Subject Enrolled:</span>
            <span className="text-slate-300 font-bold">{totalSubj} Tracks</span>
          </div>
        </div>

      </div>

    </div>
  );
}