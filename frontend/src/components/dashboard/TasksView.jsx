import React from 'react';
import { Plus, Square, CheckSquare2 } from 'lucide-react';

export default function TasksView({ handleAddTask, newTaskText, setNewTaskText, tasks, handleToggleTask }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleAddTask} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-3 items-center">
        <input 
          type="text" 
          value={newTaskText} 
          onChange={(e) => setNewTaskText(e.target.value)} 
          placeholder="Review binary search trees..." 
          className="flex-1 bg-transparent py-2 px-3 text-white placeholder-slate-500 outline-none text-sm sm:text-base" 
        />
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 text-sm shadow-md transition">
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </form>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden shadow-lg">
        {tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">All clear! No tasks listed for today.</div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task._id} 
              onClick={() => handleToggleTask(task._id)}
              className="p-4 flex items-center gap-4 hover:bg-slate-800/30 cursor-pointer transition select-none group"
            >
              <button type="button" className="text-slate-500 group-hover:text-cyan-400 transition flex-shrink-0">
                {task.completed ? <CheckSquare2 className="h-5 w-5 text-cyan-400" /> : <Square className="h-5 w-5" />}
              </button>
              <span className={`text-sm sm:text-base transition-all duration-150 ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.text}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}