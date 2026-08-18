import React, { useState } from "react";
import { 
  Calendar, 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { ScheduleEvent, WasteCategory } from "../types";
import { DEFAULT_SCHEDULES } from "../data/defaultSchedules";

export const ScheduleView: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem("waste_schedules");
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULES;
  });

  const [notificationToast, setNotificationToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    binType: string;
  } | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState<ScheduleEvent["day"]>("Tuesday");
  const [newTime, setNewTime] = useState("07:00 AM");
  const [newBinType, setNewBinType] = useState("Blue Recycling Bin");
  const [newCategory, setNewCategory] = useState<WasteCategory>("Recyclable");

  const saveSchedules = (updated: ScheduleEvent[]) => {
    setSchedules(updated);
    localStorage.setItem("waste_schedules", JSON.stringify(updated));
  };

  const toggleReminder = (id: string) => {
    const updated = schedules.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    saveSchedules(updated);
  };

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter((item) => item.id !== id);
    saveSchedules(updated);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ScheduleEvent = {
      id: `sched-${Date.now()}`,
      day: newDay,
      time: newTime,
      binType: newBinType,
      category: newCategory,
      color:
        newCategory === "Recyclable"
          ? "#2563EB"
          : newCategory === "Organic"
          ? "#16A34A"
          : newCategory === "Hazardous"
          ? "#DC2626"
          : "#64748B",
      active: true,
    };
    saveSchedules([...schedules, newEvent]);
    setShowAddModal(false);
  };

  const simulateNotification = (schedule: ScheduleEvent) => {
    setNotificationToast({
      show: true,
      title: `🔔 Collection Alert: ${schedule.binType}`,
      message: `Put out your ${schedule.binType} tomorrow by ${schedule.time}. Make sure recyclables are clean and unbagged!`,
      binType: schedule.binType,
    });

    // Try browser system notification if granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Waste Pickup Alert: ${schedule.binType}`, {
        body: `Scheduled for ${schedule.day} at ${schedule.time}.`,
      });
    } else if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    setTimeout(() => {
      setNotificationToast(null);
    }, 6000);
  };

  const daysOfWeek: ScheduleEvent["day"][] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Weekly Pickup Schedule
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
              <Calendar className="w-7 h-7 text-[#2196F3]" />
              <span>Waste Collection Schedule & Alerts</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Never miss a pickup day. Configure local collection reminders and test simulated alerts.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all flex items-center space-x-2 self-start sm:self-auto active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#2196F3]" />
            <span>Add Pickup Day</span>
          </button>
        </div>
      </div>

      {/* Simulated Live Toast Alert */}
      {notificationToast && (
        <div className="p-5 rounded-[1.75rem] bg-[#0F172A] text-white shadow-2xl border border-slate-700 flex items-start justify-between space-x-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start space-x-3.5">
            <BellRing className="w-6 h-6 text-[#2196F3] animate-bounce shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-black text-sm sm:text-base">{notificationToast.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{notificationToast.message}</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-slate-400 hover:text-white text-xs font-black uppercase px-3 py-1 bg-white/10 rounded-full shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Schedule Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            id={`schedule-row-${schedule.id}`}
            className="bg-white dark:bg-[#0F172A] rounded-[1.75rem] p-5 sm:p-6 border-2 border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/40 dark:shadow-none flex flex-col justify-between gap-4 transition-all hover:border-[#2196F3]/40"
          >
            <div className="flex items-start space-x-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 shadow-md"
                style={{ backgroundColor: schedule.color }}
              >
                {schedule.category === "Recyclable" && "♻️"}
                {schedule.category === "Organic" && "🌱"}
                {schedule.category === "Hazardous" && "⚠️"}
                {schedule.category === "Landfill" && "🗑️"}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-[#0F172A] dark:text-white text-lg">
                    {schedule.day}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-slate-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3 h-3 text-[#2196F3]" />
                    <span>{schedule.time}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {schedule.binType}
                </p>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  {schedule.category} stream
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                id={`simulate-alert-${schedule.id}`}
                onClick={() => simulateNotification(schedule)}
                className="px-3.5 py-2 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                title="Test simulated notification alert"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>Test Alert</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleReminder(schedule.id)}
                  className={`p-2.5 rounded-full border transition-all ${
                    schedule.active
                      ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-[#0F172A] dark:border-white shadow-sm"
                      : "bg-[#F1F5F9] dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}
                  title={schedule.active ? "Reminder enabled" : "Reminder paused"}
                >
                  <Bell className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="p-2.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-400 hover:text-[#F44336] hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Delete pickup"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Bento Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] max-w-md w-full p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
              Add Collection Schedule<span className="text-[#2196F3]">.</span>
            </h3>

            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Collection Day
                </label>
                <select
                  value={newDay}
                  onChange={(e) => setNewDay(e.target.value as ScheduleEvent["day"])}
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Pickup Time
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 07:00 AM"
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Stream Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as WasteCategory)}
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Recyclable">Recyclable (Blue)</option>
                  <option value="Organic">Organic / Compost (Green)</option>
                  <option value="Hazardous">Hazardous / E-Waste (Red)</option>
                  <option value="Landfill">Landfill / General (Black)</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Container Name
                </label>
                <input
                  type="text"
                  value={newBinType}
                  onChange={(e) => setNewBinType(e.target.value)}
                  placeholder="e.g. Blue Curbside Recycling Cart"
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                >
                  Save Schedule
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-3 px-5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
