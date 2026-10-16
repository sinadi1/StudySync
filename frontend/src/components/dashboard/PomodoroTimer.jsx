import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Flame } from 'lucide-react';

export default function PomodoroTimer({ showToast }) {
  // Store work duration in minutes (default 25 mins)
  const [workMinutes, setWorkMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Sync timer when user adjusts duration while timer is paused/stopped
  const adjustMinutes = (amount) => {
    if (isRunning) return; // Prevent changing while timer is active
    const newMinutes = Math.min(Math.max(workMinutes + amount, 5), 120); // Range: 5 min to 120 min
    setWorkMinutes(newMinutes);
    setTimeLeft(newMinutes * 60);
  };

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (showToast) showToast(`🎉 Focus session complete! Logged ${workMinutes} minutes!`, 'success');
      setTimeLeft(workMinutes * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, workMinutes, showToast]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(workMinutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
      {/* Protocol Label & Streak Info */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
          <Flame className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-white tracking-wide">Focus Protocol</h3>
          <p className="text-xs text-slate-400">Customizable Deep Work Session</p>
        </div>
      </div>

      {/* Dynamic Timer Display & Controls */}
      <div className="flex items-center gap-4">
        {/* Decrease by 5 min button */}
        <button
          onClick={() => adjustMinutes(-5)}
          disabled={isRunning || workMinutes <= 5}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 rounded-lg border border-slate-700/50 transition-all"
          title="Decrease by 5 minutes"
        >
          <Minus className="h-4 w-4" />
        </button>

        {/* Timer Digital Display */}
        <div className="font-mono text-3xl font-bold tracking-wider text-cyan-400 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800">
          {formatTime(timeLeft)}
        </div>

        {/* Increase by 5 min button */}
        <button
          onClick={() => adjustMinutes(5)}
          disabled={isRunning || workMinutes >= 120}
          className="p-2 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 rounded-lg border border-slate-700/50 transition-all"
          title="Increase by 5 minutes"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Start / Pause / Reset Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
            isRunning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
              : 'bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400'
          }`}
        >
          {isRunning ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button
          onClick={resetTimer}
          className="p-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700/50 transition-all"
          title="Reset Timer"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}