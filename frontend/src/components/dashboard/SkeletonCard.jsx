import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="w-full bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 w-1/3">
          <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-800 rounded-md w-1/2"></div>
        </div>
        <div className="h-8 w-24 bg-slate-800 rounded-xl"></div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="h-3 bg-slate-800 rounded-md w-full"></div>
        <div className="h-3 bg-slate-800 rounded-md w-5/6"></div>
        <div className="h-3 bg-slate-800 rounded-md w-4/6"></div>
      </div>
    </div>
  );
}