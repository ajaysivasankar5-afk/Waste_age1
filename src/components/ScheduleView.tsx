import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Bell, 
  BellRing, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  Volume2,
  Filter,
  Check,
  CalendarDays,
  ShieldAlert
} from "lucide-react";
import { ScheduleEvent, WasteCategory } from "../types";
import { DEFAULT_SCHEDULES } from "../data/defaultSchedules";

// Synthesizer chime for collection reminder alerts
const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1 (High note)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain1.gain.setValueAtTime(0.2, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2 (Higher resolve note)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.12); // D6
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    console.warn("Audio chime playback:", e);
  }
};

const DAY_ORDER: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

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
    category: WasteCategory;
  } | null>(null);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDay, setNewDay] = useState<ScheduleEvent["day"]>("Tuesday");
  const [newTime, setNewTime] = useState("07:00 AM");
  const [newBinType, setNewBinType] = useState("Blue Single-Stream Recycling Cart");
  const [newCategory, setNewCategory] = useState<WasteCategory>("Recyclable");
  const [newFrequency, setNewFrequency] = useState<"Weekly" | "Bi-Weekly" | "Monthly">("Weekly");
  const [newNotes, setNewNotes] = useState("Set out unbagged at curb by 7 AM");

  const [notifPermission, setNotifPermission] = useState<string>(() => {
    return typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default";
  });

  // Calculate Next Upcoming Collection from today's real day
  const getNextPickup = () => {
    const todayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const activeList = schedules.filter((s) => s.active);
    if (activeList.length === 0) return null;

    let closest: { schedule: ScheduleEvent; diffDays: number } | null = null;

    for (const item of activeList) {
      const itemDayIndex = DAY_ORDER[item.day] ?? 1;
      let diff = itemDayIndex - todayIndex;
      if (diff < 0) diff += 7; // Next week's cycle
      if (diff === 0) diff = 0; // Today!

      if (closest === null || diff < closest.diffDays) {
        closest = { schedule: item, diffDays: diff };
      }
    }
    return closest;
  };

  const nextPickupInfo = getNextPickup();

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
    if (window.confirm("Remove this collection reminder from your schedule?")) {
      const updated = schedules.filter((item) => item.id !== id);
      saveSchedules(updated);
    }
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: ScheduleEvent = {
      id: `sched-${Date.now()}`,
      day: newDay,
      time: newTime,
      binType: newBinType,
      category: newCategory,
      frequency: newFrequency,
      notes: newNotes,
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

  const requestBrowserNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
      if (permission === "granted") {
        playNotificationChime();
        new Notification("EcoSort Alerts Enabled", {
          body: "You will receive automated reminders before morning waste collections!",
        });
      }
    }
  };

  const simulateNotification = (schedule: ScheduleEvent) => {
    playNotificationChime();
    setNotificationToast({
      show: true,
      title: `🔔 Collection Alert: ${schedule.binType}`,
      message: `Put out your ${schedule.binType} on ${schedule.day} before ${schedule.time}. ${schedule.notes || "Ensure items are separated properly."}`,
      binType: schedule.binType,
      category: schedule.category,
    });

    // Try browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Collection Alert: ${schedule.binType}`, {
        body: `${schedule.day} at ${schedule.time} • ${schedule.notes || "Prepare bins!"}`,
      });
    }

    setTimeout(() => {
      setNotificationToast(null);
    }, 7000);
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

  const filteredSchedules = schedules.filter((s) => {
    if (filterCategory === "all") return true;
    return s.category.toLowerCase() === filterCategory.toLowerCase();
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2196F3] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Municipal Logistics & Routing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
              <Calendar className="w-7 h-7 text-[#2196F3]" />
              <span>Waste Collection Schedule & Alerts</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Sync your household pickup days, configure sound alerts, and never miss recycling or organic compost collections.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            {notifPermission !== "granted" && (
              <button
                onClick={requestBrowserNotifications}
                className="px-4 py-2.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2196F3] border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center space-x-1.5 hover:bg-blue-100 transition-colors"
                title="Enable browser push notifications"
              >
                <BellRing className="w-4 h-4" />
                <span>Enable Alerts</span>
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all flex items-center space-x-2 active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#2196F3]" />
              <span>Add Pickup Day</span>
            </button>
          </div>
        </div>

        {/* Dynamic Next Upcoming Collection Live Banner */}
        {nextPickupInfo && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F1F5F9] dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0 shadow-sm"
                style={{ backgroundColor: nextPickupInfo.schedule.color }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Next Scheduled Collection
                </span>
                <span className="text-sm sm:text-base font-black text-[#0F172A] dark:text-white">
                  {nextPickupInfo.schedule.binType} • {nextPickupInfo.schedule.day} at {nextPickupInfo.schedule.time}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]">
                {nextPickupInfo.diffDays === 0
                  ? "Today!"
                  : nextPickupInfo.diffDays === 1
                  ? "Tomorrow"
                  : `In ${nextPickupInfo.diffDays} Days`}
              </span>

              <button
                onClick={() => simulateNotification(nextPickupInfo.schedule)}
                className="p-2 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs"
                title="Test Audio Chime Alert"
              >
                <Volume2 className="w-4 h-4 text-[#2196F3]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulated Live Toast Alert */}
      {notificationToast && (
        <div className="p-5 rounded-[1.75rem] bg-[#0F172A] text-white shadow-2xl border-2 border-[#2196F3] flex items-start justify-between space-x-4 animate-in slide-in-from-top-4 duration-300">
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

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 pr-1 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {["all", "recyclable", "organic", "hazardous", "landfill"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filterCategory === cat
                ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-xs"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schedule Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedules.map((schedule) => (
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

              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-[#0F172A] dark:text-white text-lg">
                    {schedule.day}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-[#F1F5F9] dark:bg-slate-800 px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3 h-3 text-[#2196F3]" />
                    <span>{schedule.time}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                  {schedule.binType}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {schedule.category} Stream
                  </span>
                  {schedule.frequency && (
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                      {schedule.frequency}
                    </span>
                  )}
                </div>
                {schedule.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic pt-1">
                    "{schedule.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                id={`simulate-alert-${schedule.id}`}
                onClick={() => simulateNotification(schedule)}
                className="px-3.5 py-2 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                title="Test simulated notification alert with sound"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>Test Chime</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleReminder(schedule.id)}
                  className={`p-2.5 rounded-full border transition-all ${
                    schedule.active
                      ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-[#0F172A] dark:border-white shadow-sm"
                      : "bg-[#F1F5F9] dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                  }`}
                  title={schedule.active ? "Reminder active" : "Reminder paused"}
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

              <div className="grid grid-cols-2 gap-3">
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
                    Recurrence
                  </label>
                  <select
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value as any)}
                    className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
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

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Reminder Note
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Set out before 7:00 AM, unbagged"
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
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
