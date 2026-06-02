import React, { useState } from 'react';
import { Save, User } from 'lucide-react';

export default function SettingsView({ userData, handleUpdateProfile }) {
  const [name, setName] = useState(userData?.name || '');
  const [school, setSchool] = useState(userData?.school || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const success = await handleUpdateProfile({ name, school });
    
    setIsSaving(false);
    if (success) {
      setMessage('Profile updated successfully! 🎉');
    } else {
      setMessage('Failed to update profile. Try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-cyan-400" /> Account Settings
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white outline-none focus:border-cyan-500 transition text-sm"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Institution / School</label>
            <input 
              type="text" 
              value={school} 
              onChange={(e) => setSchool(e.target.value)} 
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white outline-none focus:border-cyan-500 transition text-sm"
              placeholder="e.g., Stanford University"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address (Read-Only)</label>
            <input 
              type="email" 
              value={userData?.email || ''} 
              disabled 
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 px-4 text-slate-500 cursor-not-allowed text-sm outline-none"
            />
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.includes('successfully') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {message}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isSaving}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}