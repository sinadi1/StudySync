import React, { useEffect, useState } from 'react';
import { Clock, BookOpen, CheckSquare, BarChart3, Inbox } from 'lucide-react';
import axios from 'axios';

export default function OverviewView({ token }) {
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
        console.error("Failed to load overview metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [token]);

  if (loading) {
    return <div className="text-center text-slate-500 text-sm py-12">Calculating application metrics matrix...</div>;
  }

  const totalHours = stats?.totalHours || 0;
  const totalSubjects = stats?.totalSubjects || 0;
  const completedSubjects = stats?.completedSubjects || 0;
  const totalTasks = stats?.totalTasks || 0;
  const completedTasks = stats?.completedTasks || 0;
  const taskCompletionRate = stats?.taskCompletionRate || 0;

  return (
    <div className="space-y-8 animate-fadeIn">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Clock className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Invested</p>
            <h3 className="text-2xl font-bold text-white">{totalHours} hrs</h3>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><BookOpen className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Tracks</p>
            <h3 className="text-2xl font-bold text-white">{totalSubjects}</h3>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><CheckSquare className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks Done</p>
            <h3 className="text-2xl font-bold text-white">{completedTasks} / {totalTasks}</h3>
          </div>
        </div>

        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-md">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><BarChart3 className="h-6 w-6" /></div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Task Efficiency</p>
            <h3 className="text-2xl font-bold text-white">{taskCompletionRate}%</h3>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div>
          <h4 className="text-base font-bold text-white mb-1">Weekly Targets & Velocity Indicators</h4>
          <p className="text-xs text-slate-500">Live operational data calculated straight from your connected cluster storage nodes.</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-400 uppercase tracking-wider">Overall Task Execution Velocity</span>
              <span className="text-cyan-400">{taskCompletionRate}%</span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-slate-400 uppercase tracking-wider">Track Completion Ratio</span>
              <span className="text-emerald-400">
                {totalSubjects > 0 ? Math.round((completedSubjects / totalSubjects) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${totalSubjects > 0 ? (completedSubjects / totalSubjects) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}