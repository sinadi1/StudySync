import React, { useState } from 'react';
import { Plus, BookMarked, Clock } from 'lucide-react';

export default function StudyTrackerView({ handleAddSubject, newSubjectName, setNewSubjectName, subjects, handleUpdateHours }) {
  const [hoursInput, setHoursInput] = useState({});

  const handleInputChange = (id, value) => {
    setHoursInput((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmitHours = (e, id) => {
    e.preventDefault();
    const hours = hoursInput[id];
    if (!hours || isNaN(hours) || hours <= 0) return;
    
    handleUpdateHours(id, hours);
    setHoursInput((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddSubject} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 items-end sm:items-center">
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Add New Subject Track</label>
          <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="e.g., Data Structures and Algorithms" className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition" />
        </div>
        <button type="submit" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition">
          <Plus className="h-5 w-5" /> Add Track
        </button>
      </form>

      {subjects.length === 0 ? (
        <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center text-slate-500">
          <BookMarked className="h-12 w-12 mx-auto text-slate-700 mb-3" />
          <p className="text-base font-medium">No active tracks yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subj) => (
            <div key={subj._id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-bold text-white truncate max-w-[70%]">{subj.name}</h4>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    subj.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    subj.status === 'In Progress' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                    'bg-slate-800 border-slate-700 text-slate-400'
                  } capitalize`}>
                    {subj.status}
                  </span>
                </div>
              </div>

              <form onSubmit={(e) => onSubmitHours(e, subj._id)} className="flex gap-2 items-center">
                <input 
                  type="number" 
                  min="1"
                  step="any"
                  value={hoursInput[subj._id] || ''}
                  onChange={(e) => handleInputChange(subj._id, e.target.value)}
                  placeholder="Hrs" 
                  className="w-16 rounded-lg border border-slate-700 bg-slate-800/40 py-1.5 px-2 text-center text-sm text-white outline-none focus:border-cyan-500 transition"
                />
                <button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-cyan-400">
                  <Clock className="h-3.5 w-3.5" /> Log Hours
                </button>
              </form>

              <div className="text-sm font-medium text-slate-500 border-t border-slate-800/60 pt-3 flex justify-between items-center">
                <span>Time Logged:</span>
                <span className="text-slate-300 font-semibold">{subj.hoursStudied} hours</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}