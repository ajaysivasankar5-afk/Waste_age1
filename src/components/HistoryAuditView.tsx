import React from "react";
import { 
  BarChart3, 
  Award, 
  Trash2, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Leaf, 
  RotateCcw,
  ArrowUpRight
} from "lucide-react";
import { WasteAuditEntry, WasteCategory } from "../types";
import { CATEGORY_COLORS } from "../data/wasteCatalog";

interface HistoryAuditViewProps {
  auditEntries: WasteAuditEntry[];
  onClearAudit: () => void;
  onRemoveEntry: (id: string) => void;
  ecoPoints: number;
}

export const HistoryAuditView: React.FC<HistoryAuditViewProps> = ({
  auditEntries,
  onClearAudit,
  onRemoveEntry,
  ecoPoints,
}) => {
  const totalScans = auditEntries.length;

  const counts: Record<WasteCategory, number> = {
    Recyclable: auditEntries.filter((e) => e.category === "Recyclable").length,
    Organic: auditEntries.filter((e) => e.category === "Organic").length,
    Hazardous: auditEntries.filter((e) => e.category === "Hazardous").length,
    Landfill: auditEntries.filter((e) => e.category === "Landfill").length,
  };

  const divertedCount = counts.Recyclable + counts.Organic + counts.Hazardous;
  const diversionRate = totalScans > 0 ? Math.round((divertedCount / totalScans) * 100) : 0;

  const exportCSV = () => {
    if (auditEntries.length === 0) return;
    const headers = "ID,Item Name,Category,Material,Diverted From Landfill,Date\n";
    const rows = auditEntries
      .map(
        (e) =>
          `"${e.id}","${e.itemName}","${e.category}","${e.material}","${
            e.divertedFromLandfill ? "Yes" : "No"
          }","${new Date(e.timestamp).toLocaleString()}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `waste-audit-log-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRank = (pts: number) => {
    if (pts >= 200) return { title: "Zero-Waste Champion", badge: "🏆 Master Tier", color: "text-amber-500" };
    if (pts >= 100) return { title: "Eco Guardian", badge: "🌟 Gold Tier", color: "text-emerald-500" };
    if (pts >= 50) return { title: "Active Recycler", badge: "🌱 Silver Tier", color: "text-blue-500" };
    return { title: "Eco Beginner", badge: "🌾 Bronze Tier", color: "text-slate-500" };
  };

  const rank = getRank(ecoPoints);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Diversion & Impact Tracker
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
              <BarChart3 className="w-7 h-7 text-[#2196F3]" />
              <span>Household Waste Audit & Analytics</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Track your segregation history, landfill diversion score, and accumulated eco-points.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            {totalScans > 0 && (
              <>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4 text-[#2196F3]" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={onClearAudit}
                  className="p-2.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-[#F44336] border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Clear all audit history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Top 4 KPI Metrics in Bento Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-2">
          <div className="bg-[#F1F5F9] dark:bg-slate-800/80 rounded-[1.5rem] p-5 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Total Scans
            </span>
            <p className="text-3xl font-black text-[#0F172A] dark:text-white">
              {totalScans}
            </p>
            <span className="text-[11px] font-semibold text-slate-500">Logged to audit</span>
          </div>

          <div className="bg-green-50/80 dark:bg-green-950/30 rounded-[1.5rem] p-5 border border-green-200 dark:border-green-800/60 space-y-1">
            <span className="text-[10px] font-black text-[#4CAF50] uppercase tracking-widest block">
              Diversion Rate
            </span>
            <p className="text-3xl font-black text-[#4CAF50]">
              {diversionRate}%
            </p>
            <span className="text-[11px] font-semibold text-green-900 dark:text-green-300">{divertedCount} of {totalScans} diverted</span>
          </div>

          <div className="bg-blue-50/80 dark:bg-blue-950/30 rounded-[1.5rem] p-5 border border-blue-200 dark:border-blue-800/60 space-y-1">
            <span className="text-[10px] font-black text-[#2196F3] uppercase tracking-widest block">
              Eco Rewards
            </span>
            <p className="text-3xl font-black text-[#2196F3] flex items-center space-x-1">
              <span>{ecoPoints}</span>
              <span className="text-xs text-[#2196F3] font-bold">pts</span>
            </p>
            <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-300">+10 pts per scan</span>
          </div>

          <div className="bg-[#F1F5F9] dark:bg-slate-800/80 rounded-[1.5rem] p-5 border border-slate-200/80 dark:border-slate-700 space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Eco Tier
            </span>
            <p className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white truncate">
              {rank.title}
            </p>
            <span className={`text-[11px] font-black ${rank.color}`}>
              {rank.badge}
            </span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
        <h3 className="font-black text-base text-[#0F172A] dark:text-white">
          Material Stream Distribution
        </h3>

        <div className="space-y-4 pt-1">
          {/* Recyclable */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-[#2196F3]">♻️ Recyclables ({counts.Recyclable})</span>
              <span className="text-slate-600 dark:text-slate-400">{totalScans > 0 ? Math.round((counts.Recyclable / totalScans) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
              <div 
                className="h-full bg-[#2196F3] rounded-full transition-all duration-500" 
                style={{ width: `${totalScans > 0 ? (counts.Recyclable / totalScans) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Organic */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-[#4CAF50]">🌱 Organic / Compost ({counts.Organic})</span>
              <span className="text-slate-600 dark:text-slate-400">{totalScans > 0 ? Math.round((counts.Organic / totalScans) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
              <div 
                className="h-full bg-[#4CAF50] rounded-full transition-all duration-500" 
                style={{ width: `${totalScans > 0 ? (counts.Organic / totalScans) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Hazardous */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-[#F44336]">⚠️ Hazardous / E-Waste ({counts.Hazardous})</span>
              <span className="text-slate-600 dark:text-slate-400">{totalScans > 0 ? Math.round((counts.Hazardous / totalScans) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
              <div 
                className="h-full bg-[#F44336] rounded-full transition-all duration-500" 
                style={{ width: `${totalScans > 0 ? (counts.Hazardous / totalScans) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Landfill */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black">
              <span className="text-slate-600 dark:text-slate-400">🗑️ Landfill Residual ({counts.Landfill})</span>
              <span className="text-slate-600 dark:text-slate-400">{totalScans > 0 ? Math.round((counts.Landfill / totalScans) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3.5 bg-[#F1F5F9] dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
              <div 
                className="h-full bg-slate-600 rounded-full transition-all duration-500" 
                style={{ width: `${totalScans > 0 ? (counts.Landfill / totalScans) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scanned Items Log Table */}
      <div className="space-y-4">
        <h3 className="font-black text-lg text-[#0F172A] dark:text-white">
          Item Scan History ({auditEntries.length})
        </h3>

        {auditEntries.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0F172A] rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-3">
            <Leaf className="w-10 h-10 text-[#4CAF50] mx-auto animate-pulse" />
            <p className="text-base font-black text-slate-800 dark:text-slate-200">
              No waste items logged yet
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Scan items using the camera or search bar, then click "Log in My Waste Audit" to start earning points.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/30 dark:shadow-none">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {auditEntries.map((entry) => {
                const colors = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.Landfill;
                return (
                  <div
                    key={entry.id}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-[#F1F5F9]/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shrink-0 shadow-sm"
                        style={{ backgroundColor: colors.hex }}
                      >
                        {entry.category === "Recyclable" && "♻️"}
                        {entry.category === "Organic" && "🌱"}
                        {entry.category === "Hazardous" && "⚠️"}
                        {entry.category === "Landfill" && "🗑️"}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-black text-[#0F172A] dark:text-white text-sm truncate">
                          {entry.itemName}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.badge}`}>
                            {entry.category}
                          </span>
                          <span className="truncate font-medium">{entry.material}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="text-xs font-semibold text-slate-400 hidden sm:block">
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button
                        onClick={() => onRemoveEntry(entry.id)}
                        className="text-slate-400 hover:text-[#F44336] p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Remove entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
