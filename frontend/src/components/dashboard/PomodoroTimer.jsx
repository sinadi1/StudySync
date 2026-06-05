import React, { useState, useEffect } from 'react';
import { Play, Square, Coffee, Flame } from 'lucide-react';

export default function PomodoroTimer({ showToast }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Cycle finished!
            setIsActive(false);
            if (!isBreak) {
              showToast("🔥 Focus session complete! Time for a well-deserved break.", "success");
              setIsBreak(true);
              setMinutes(5);
            } else {
              showToast("⚡ Break is over! Let's get back to crushing your tracks.", "info");
              setIsBreak(false);
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak, showToast]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {isBreak ? <Coffee className="h-4 w-4 text-emerald-400" /> : <Flame className="h-4 w-4 text-cyan-400" />}
          <h4 className="text-sm font-bold text-white">{isBreak ? "Break Zone" : "Focus Protocol"}</h4>
        </div>
        <p className="text-xs text-slate-500">{isActive ? "Session in progress..." : "Ready to lock in?"}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-3xl font-black text-white tracking-wider tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              isActive 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            {isActive ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-300"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}