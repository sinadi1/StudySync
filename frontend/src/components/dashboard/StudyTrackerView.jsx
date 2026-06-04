import React, { useState } from "react";
import axios from "axios";
import { Plus, BookMarked, Clock, CheckCircle, Circle } from "lucide-react";

export default function StudyTrackerView({
  handleAddSubject,
  newSubjectName,
  setNewSubjectName,
  subjects,
  token,
  handleToggleStatus,
  handleUpdateHours,
}) {
  const [hoursInput, setHoursInput] = useState({});
  const [milestoneReport, setMilestoneReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewMilestone = async (id) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/analytics/milestone/" + id,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );
      if (res.data && res.data.success) {
        setMilestoneReport(res.data.report);
        setShowModal(true);
      }
    } catch (err) {
      alert("Failed to load report");
    }
  };

  const handleInputChange = (id, value) => {
    setHoursInput((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmitHours = (e, id) => {
    e.preventDefault();
    const hours = hoursInput[id];
    if (!hours || isNaN(hours) || hours <= 0) return;

    handleUpdateHours(id, hours);
    setHoursInput((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleAddSubject}
        className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row gap-4 items-end sm:items-center"
      >
        <div className="flex-1 w-full">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Add New Subject Track
          </label>
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="e.g., Data Structures and Algorithms"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-3 px-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition"
        >
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
            <div
              key={subj._id}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <button
                    onClick={() => handleToggleStatus(subj._id)}
                    className="mt-1 text-slate-500 hover:text-cyan-400 transition flex-shrink-0"
                    title="Toggle Completion Status"
                  >
                    {subj.status === "Completed" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <h4
                    className={`text-lg font-bold flex-1 truncate ${subj.status === "Completed" ? "line-through text-slate-500" : "text-white"}`}
                  >
                    {subj.name}
                  </h4>

                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${
                      subj.status === "Completed"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : subj.status === "In Progress"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                    } capitalize`}
                  >
                    {subj.status}
                  </span>
                </div>
              </div>

              <form
                onSubmit={(e) => onSubmitHours(e, subj._id)}
                className="flex gap-2 items-center"
              >
                <input
                  type="number"
                  min="1"
                  step="any"
                  disabled={subj.status === "Completed"}
                  value={hoursInput[subj._id] || ""}
                  onChange={(e) => handleInputChange(subj._id, e.target.value)}
                  placeholder="Hrs"
                  className="w-16 rounded-lg border border-slate-700 bg-slate-800/40 py-1.5 px-2 text-center text-sm text-white outline-none focus:border-cyan-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={subj.status === "Completed"}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Clock className="h-3.5 w-3.5" /> Log Hours
                </button>
              </form>

              <div className="text-sm font-medium text-slate-500 border-t border-slate-800/60 pt-3 flex justify-between items-center">
                <span>Time Logged:</span>
                <span className="text-slate-300 font-semibold">
                  {subj.hoursStudied} hours
                </span>
              </div>
              {subj.status === "Completed" && (
                <button
                  onClick={() => handleViewMilestone(subj._id)}
                  className="mt-3 w-full py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-xs text-cyan-400 font-semibold rounded-xl border border-slate-700/50 transition-colors"
                >
                  View Summary Report
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {showModal && milestoneReport && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold text-white">{milestoneReport.name}</h4>
          <p className="text-xs text-slate-500">Automated Session Milestone Report</p>
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="text-slate-400 hover:text-white text-sm font-semibold px-2 py-1 bg-slate-800 rounded-lg border border-slate-700/50"
        >
          ✕
        </button>
      </div>

      <div className="border-t border-slate-800/80 pt-3 space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Total Invested Effort:</span>
          <span className="text-cyan-400 font-bold">{milestoneReport.hoursStudied} hours</span>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-400">Remaining Backlog Tasks:</span>
          <span className="text-amber-400 font-bold">{milestoneReport.remainingQueueTasks} pending</span>
        </div>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">System Recommendation</p>
        <p className="text-xs text-slate-300 leading-relaxed italic">"{milestoneReport.recommendation}"</p>
      </div>

      <button 
        onClick={() => setShowModal(false)}
        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-90 active:opacity-100 text-xs text-white font-bold rounded-xl transition-all shadow-md"
      >
        Acknowledge Milestone
      </button>
    </div>
  </div>
)}
    </div>
  );
}
