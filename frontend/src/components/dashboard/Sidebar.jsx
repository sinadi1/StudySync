import React from 'react';
import { LogOut } from 'lucide-react';

export default function Sidebar({ menuItems, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out
      md:translate-x-0 md:static md:h-screen
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      pt-16 md:pt-0
    `}>
      <div className="px-6 py-5 hidden md:block">
        <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          STUDYSYNC
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-150 ${
                isActive 
                  ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' 
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/60">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 transition duration-150">
          <LogOut className="h-5 w-5" /> Sign Out
        </button>
      </div>
    </aside>
  );
}