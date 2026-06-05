import React, { useState } from 'react';
import { User, Mail, ShieldCheck, RefreshCw } from 'lucide-react';

export default function SettingsView({ userData, handleUpdateProfile }) {
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    setIsUpdating(true);
    setMessage('');
    
    const success = await handleUpdateProfile({ name, email });
    setIsUpdating(false);
    
    if (success) {
      setMessage('Profile updated successfully! ✨');
      setTimeout(() => setMessage(''), 4000);
    } else {
      setMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-cyan-400" />
          Account Configurations
        </h3>
        <p className="text-xs text-slate-500">Manage your system profile identity details and metadata targets</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-500" /> Full Identity Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-300"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-500" /> Communications Email Target
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none transition-all duration-300"
            placeholder="Enter your email"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-semibold text-center border ${
            message.includes('successfully') 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-cyan-500/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isUpdating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            'Commit Profile Changes'
          )}
        </button>
      </form>
    </div>
  );
}