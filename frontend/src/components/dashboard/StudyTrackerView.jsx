import React from 'react';
import { Plus, BookMarked } from 'lucide-react';

export default function StudyTrackerView({ handleAddSubject, newSubjectName, setNewSubjectName, subjects }) {
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
            <div key={subj._id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between h-36">
              <div>
                <h4 className="text-lg font-bold text-white truncate">{subj.name}</h4>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-cyan-400 capitalize">{subj.status}</span>
              </div>
              <div className="text-sm font-medium text-slate-500 border-t border-slate-800/60 pt-3 flex justify-between">
                <span>Time Logged:</span><span className="text-slate-300 font-semibold">{subj.hoursStudied} hours</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}