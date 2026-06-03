import React, { useState } from 'react';
import { Plus, Square, CheckSquare2, Trash2, ShieldAlert, Award, Inbox } from 'lucide-react';

export default function TasksView({ handleAddTask, newTaskText, setNewTaskText, tasks, handleToggleTask, handleDeleteTask }) {
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    handleAddTask(e, priority); 
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const highPriority = filteredTasks.filter(t => t.priority === 'High');
  const mediumPriority = filteredTasks.filter(t => t.priority === 'Medium');
  const lowPriority = filteredTasks.filter(t => t.priority === 'Low');

  const TaskRow = ({ task }) => (
    <div className="p-4 flex items-center justify-between hover:bg-slate-800/40 border border-slate-800/40 bg-slate-900/30 rounded-xl transition select-none group">
      <div 
        onClick={() => handleToggleTask(task._id)}
        className="flex items-center gap-4 cursor-pointer flex-1 min-w-0"
      >
        <button type="button" className="text-slate-500 group-hover:text-cyan-400 transition flex-shrink-0">
          {task.completed ? <CheckSquare2 className="h-5 w-5 text-cyan-400" /> : <Square className="h-5 w-5" />}
        </button>
        <span className={`text-sm sm:text-base transition-all duration-150 truncate ${
          task.completed ? 'line-through text-slate-500' : 'text-slate-200'
        }`}>
          {task.text}
        </span>
      </div>
      <button 
        onClick={() => handleDeleteTask(task._id)}
        className="text-slate-600 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Delete Task"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <form onSubmit={onSubmit} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <input 
          type="text" 
          value={newTaskText} 
          onChange={(e) => setNewTaskText(e.target.value)} 
          placeholder="What objective are you mastering next?..." 
          className="flex-1 bg-transparent py-2 px-3 text-white placeholder-slate-600 outline-none text-sm sm:text-base" 
        />
        <div className="flex items-center gap-3 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-800/80 text-sm text-slate-300 border border-slate-700/80 rounded-xl px-4 py-2 outline-none focus:border-cyan-500 transition cursor-pointer font-medium"
          >
            <option value="High">💥 High</option>
            <option value="Medium">⚡ Medium</option>
            <option value="Low">🌱 Low</option>
          </select>
          <button type="submit" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm shadow-md transition transform active:scale-95 duration-75">
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      </form>

      <div className="flex gap-2 border-b border-slate-800/80 pb-1">
        {['All', 'Pending', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition duration-150 border-b-2 -mb-[3px] ${
              filter === tab ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800/60 p-16 text-center text-slate-500 max-w-xl mx-auto shadow-inner">
          <Inbox className="h-10 w-10 mx-auto text-slate-700 mb-4" />
          <h4 className="text-base font-semibold text-slate-400 mb-1">Queue Completely Clear</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">No {filter !== 'All' ? filter.toLowerCase() : ''} tasks found in this tracking bracket matrix.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {highPriority.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <ShieldAlert className="h-4 w-4 text-rose-400" />
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider">Urgent Focus Objectives ({highPriority.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">{highPriority.map(t => <TaskRow key={t._id} task={t} />)}</div>
            </div>
          )}

          {mediumPriority.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1 pt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Active Baseline Queue ({mediumPriority.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">{mediumPriority.map(t => <TaskRow key={t._id} task={t} />)}</div>
            </div>
          )}

          {lowPriority.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1 pt-2">
                <Award className="h-4 w-4 text-slate-400" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Backlog / Low Overhead ({lowPriority.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-2.5">{lowPriority.map(t => <TaskRow key={t._id} task={t} />)}</div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}