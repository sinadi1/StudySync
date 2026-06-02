import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, BarChart2, Settings, Menu, X, User as UserIcon } from 'lucide-react';
import axios from 'axios';

import Sidebar from '../components/dashboard/Sidebar';
import OverviewView from '../components/dashboard/OverviewView';
import StudyTrackerView from '../components/dashboard/StudyTrackerView';
import TasksView from '../components/dashboard/TasksView';
import AnalyticsView from '../components/dashboard/AnalyticsView';

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
  const [analyticsData, setAnalyticsData] = useState({ totalSubjects: 0, totalHours: 0, totalTasks: 0, completedTasks: 0, taskCompletionRate: 0 });

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
        const response = await axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data && response.data.success) setUserData(response.data.user);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally { setLoading(false); }
    };
    fetchUserProfile();
  }, [navigate, token]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.success) setSubjects(response.data.subjects);
    } catch (error) { console.error(error); }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/subjects', { name: newSubjectName }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.success) { setNewSubjectName(''); fetchSubjects(); }
    } catch (error) { alert('Failed to add subject'); }
  };

  const handleUpdateHours = async (id, hours) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/subjects/${id}/hours`, 
        { hours },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data && response.data.success) {
        fetchSubjects();
      }
    } catch (error) {
      alert('Failed to log hours. Try again.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/subjects/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        fetchSubjects(); // Instantly update UI lists
      }
    } catch (error) {
      alert('Failed to update status. Try again.');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.success) setTasks(response.data.tasks);
    } catch (error) { console.error(error); }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', { text: newTaskText }, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.success) { setNewTaskText(''); fetchTasks(); }
    } catch (error) { alert('Failed to add task'); }
  };

  const handleToggleTask = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.success) fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.success) {
        fetchTasks();
      }
    } catch (error) {
      alert('Failed to delete task. Try again.');
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics', { headers: { Authorization: `Bearer ${token}` } });
        if (response.data && response.data.success) setAnalyticsData(response.data.analytics);
      } catch (error) { console.error(error); }
    };

    if (activeTab === 'Overview') fetchAnalytics();
    if (activeTab === 'Study Tracker') fetchSubjects();
    if (activeTab === 'Tasks') fetchTasks();
    if (activeTab === 'Analytics') fetchAnalytics();
  }, [activeTab, token]);

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-semibold tracking-wider">Loading workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <span className="text-xl font-bold tracking-wider text-cyan-400">StudySync</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-400 hover:text-white">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <Sidebar menuItems={menuItems} activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} />

      <main className="flex-1 min-w-0 flex flex-col pt-16 md:pt-0">
        <header className="h-16 border-b border-slate-800/60 bg-slate-950 flex items-center justify-between px-8 hidden md:flex">
          <h2 className="text-xl font-semibold text-white">{activeTab}</h2>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full">
            <UserIcon className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-slate-300">{userData ? userData.name : 'User'}</span>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {activeTab === 'Overview' && <OverviewView userData={userData} analyticsData={analyticsData} />}
          {activeTab === 'Study Tracker' && <StudyTrackerView handleAddSubject={handleAddSubject} newSubjectName={newSubjectName} setNewSubjectName={setNewSubjectName} subjects={subjects} handleUpdateHours={handleUpdateHours} handleToggleStatus={handleToggleStatus}/>}
          {activeTab === 'Tasks' && <TasksView handleAddTask={handleAddTask} newTaskText={newTaskText} setNewTaskText={setNewTaskText} tasks={tasks} handleToggleTask={handleToggleTask} handleDeleteTask={handleDeleteTask}/>}
          {activeTab === 'Analytics' && <AnalyticsView analyticsData={analyticsData} />}
          {activeTab === 'Settings' && (
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center py-20">
              <h3 className="text-xl font-bold text-white mb-1">Settings Feature Panel</h3>
              <p className="text-slate-400 text-sm">This space will host your account configuration modules.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}