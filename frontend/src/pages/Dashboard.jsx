import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Plus,
  BookMarked,
  Square,
  CheckSquare2
} from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [userData, setUserData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalSubjects: 0,
    totalHours: 0,
    totalTasks: 0,
    completedTasks: 0,
    taskCompletionRate: 0
  });

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Study Tracker', icon: BookOpen },
    { name: 'Tasks', icon: CheckSquare },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Settings', icon: Settings },
  ];

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.success) {
          setUserData(response.data.user);
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [navigate, token]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/subjects', 
        { name: newSubjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.success) {
        setNewSubjectName('');
        fetchSubjects();
      }
    } catch (error) {
      alert('Failed to add subject');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/tasks',
        { text: newTaskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.success) {
        setNewTaskText('');
        fetchTasks();
      }
    } catch (error) {
      alert('Failed to add task');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.success) {
          setAnalyticsData(response.data.analytics);
        }
      } catch (error) {
        console.error("Error fetching analytics", error);
      }
    };

    if (activeTab === 'Overview') fetchAnalytics();
    if (activeTab === 'Study Tracker') fetchSubjects();
    if (activeTab === 'Tasks') fetchTasks();
    if (activeTab === 'Analytics') fetchAnalytics();
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-semibold tracking-wider">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <span className="text-xl font-bold tracking-wider text-cyan-400">StudySync</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out
        md:translate-x-0 md:static md:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${'pt-16 md:pt-0'}
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

      <main className="flex-1 min-w-0 flex flex-col pt-16 md:pt-0">
        <header className="h-16 border-b border-slate-800/60 bg-slate-950 flex items-center justify-between px-8 hidden md:flex">
          <h2 className="text-xl font-semibold text-white">{activeTab}</h2>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full">
            <UserIcon className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{userData ? userData.name : 'User'}</span>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">

          {/* OVERVIEW PANEL */}
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-2">Welcome to your Workspace, {userData ? userData.name : 'Learner'}! 🚀</h3>
                <p className="text-slate-400 max-w-2xl">Your profile details have been successfully pulled straight from your MongoDB cloud database cluster.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Subjects</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {analyticsData.totalSubjects}
                  </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completed Tasks</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {analyticsData.taskCompletionRate}%
                  </div>
                </div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800/80">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Study Hours</span>
                  <div className="text-2xl font-bold text-white mt-1">
                    {analyticsData.totalHours} hrs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDY TRACKER PANEL */}
          {activeTab === 'Study Tracker' && (
            <div className="space-y-6">
              <form onSubmit={handleAddSubject} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Add New Subject Track</label>
                  <input type="text" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} placeholder="e.g., Data Structures and Algorithms" className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition" />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"><Plus className="h-5 w-5" /> Add Track</button>
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
          )}

          {/* TASKS PANEL */}
          {activeTab === 'Tasks' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <form onSubmit={handleAddTask} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-3 items-center">
                <input 
                  type="text" 
                  value={newTaskText} 
                  onChange={(e) => setNewTaskText(e.target.value)} 
                  placeholder="Review binary search trees, complete flexbox layout..." 
                  className="flex-1 bg-transparent py-2 px-3 text-white placeholder-slate-500 outline-none text-sm sm:text-base" 
                />
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 text-sm shadow-md transition">
                  <Plus className="h-4 w-4" /> Add Task
                </button>
              </form>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden shadow-lg">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    All clear! No tasks listed for today.
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div 
                      key={task._id} 
                      onClick={() => handleToggleTask(task._id)}
                      className="p-4 flex items-center gap-4 hover:bg-slate-800/30 cursor-pointer transition select-none group"
                    >
                      <button type="button" className="text-slate-500 group-hover:text-cyan-400 transition flex-shrink-0">
                        {task.completed ? (
                          <CheckSquare2 className="h-5 w-5 text-cyan-400" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                      <span className={`text-sm sm:text-base transition-all duration-150 ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}>
                        {task.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS PANEL */}
          {activeTab === 'Analytics' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-4">Task Execution Metric</h3>
                <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${analyticsData.taskCompletionRate}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">
                  You have finished <span className="text-cyan-400 font-semibold">{analyticsData.completedTasks}</span> out of <span className="text-slate-200 font-semibold">{analyticsData.totalTasks}</span> assigned check-items.
                </p>
              </div>
            </div>
          )}

          {/* SETTINGS PANEL */}
          {activeTab === 'Settings' && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center py-20">
              <h3 className="text-xl font-bold text-white mb-1">Settings Feature Panel</h3>
              <p className="text-slate-400 text-sm">This space will host your custom account settings configuration modules.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}