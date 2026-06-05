import React from 'react';
import { Award, ShieldAlert, Zap, Trophy } from 'lucide-react';

export default function MilestoneBadges({ subjects = [], streakCount = 0 }) {
  const totalHours = subjects.reduce((acc, curr) => acc + (curr.hoursStudied || 0), 0);
  
  const badges = [
    {
      id: 'first_step',
      name: 'Initiation Completed',
      desc: 'Log your first study hour',
      unlocked: totalHours >= 1,
      icon: <Zap className="h-5 w-5" />,
      color: 'from-amber-500 to-orange-500'
    },
    {
      id: 'consistency',
      name: 'Momentum Builder',
      desc: 'Establish an active daily streak chain',
      unlocked: streakCount >= 1,
      icon: <Award className="h-5 w-5" />,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'deep_work',
      name: 'Mastery Engine',
      desc: 'Accumulate 10 total track hours',
      unlocked: totalHours >= 10,
      icon: <Trophy className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
      <div>
        <h4 className="text-sm font-bold text-white">Unlocked Prestige Badges</h4>
        <p className="text-xs text-slate-500">Gamified milestones earned through deep focus habits</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
              badge.unlocked 
                ? 'bg-slate-950/40 border-slate-800/80' 
                : 'bg-slate-950/10 border-slate-900 opacity-40 grayscale'
            }`}
          >
            <div className={`p-2.5 rounded-lg text-white bg-gradient-to-br ${badge.unlocked ? badge.color : 'from-slate-800 to-slate-900'}`}>
              {badge.icon}
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-200 truncate">{badge.name}</h5>
              <p className="text-[10px] text-slate-500 line-clamp-1">{badge.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}