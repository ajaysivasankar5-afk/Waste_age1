import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Square, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RotateCcw, 
  Award,
  ShieldCheck,
  Leaf,
  Recycle,
  Trash2,
  Home
} from "lucide-react";
import confetti from "canvas-confetti";
import { WASTE_CHECKLISTS } from "../data/wasteChecklists";
import { WasteChecklistCategory } from "../types";

interface ChecklistsViewProps {
  onEarnPoints?: (pts: number) => void;
}

export const ChecklistsView: React.FC<ChecklistsViewProps> = ({ onEarnPoints }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("recyclables-protocol");
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("waste_completed_checklists");
    return saved ? JSON.parse(saved) : {};
  });

  const [awardedCategories, setAwardedCategories] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("waste_awarded_checklists");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("waste_completed_checklists", JSON.stringify(completedItems));
  }, [completedItems]);

  useEffect(() => {
    localStorage.setItem("waste_awarded_checklists", JSON.stringify(awardedCategories));
  }, [awardedCategories]);

  const activeCategoryData =
    WASTE_CHECKLISTS.find((c) => c.id === selectedCategory) || WASTE_CHECKLISTS[0];

  const totalItemsCount = activeCategoryData.items.length;
  const completedCount = activeCategoryData.items.filter((item) => !!completedItems[item.id]).length;
  const progressPercent = Math.round((completedCount / totalItemsCount) * 100);

  const toggleCheck = (itemId: string) => {
    const nextState = !completedItems[itemId];
    const updated = { ...completedItems, [itemId]: nextState };
    setCompletedItems(updated);

    // Check if the current active category is now 100% complete
    const isNowAllDone = activeCategoryData.items.every((i) =>
      i.id === itemId ? nextState : updated[i.id]
    );

    if (isNowAllDone && !awardedCategories[activeCategoryData.id]) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#16A34A", "#2563EB", "#F59E0B"],
      });
      setAwardedCategories((prev) => ({ ...prev, [activeCategoryData.id]: true }));
      if (onEarnPoints) {
        onEarnPoints(20);
      }
    }
  };

  const resetCurrentCategory = () => {
    if (window.confirm(`Reset progress for ${activeCategoryData.title}?`)) {
      const updated = { ...completedItems };
      activeCategoryData.items.forEach((item) => {
        delete updated[item.id];
      });
      setCompletedItems(updated);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Hero Bento Header Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Quality Assurance & Zero Contamination
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Waste Segregation Checklists<span className="text-[#2196F3]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Step-by-step preparation criteria before item disposal. Prevent load contamination, protect sanitation workers, and earn eco badges.
            </p>
          </div>

          {/* Quick Progress Bento Metric */}
          <div className="p-5 rounded-[1.75rem] bg-[#0F172A] text-white flex items-center space-x-5 shadow-xl shadow-slate-900/10 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#334155"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#2196F3"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute text-sm font-black">{progressPercent}%</span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Current Protocol
              </span>
              <span className="text-base font-black block">
                {completedCount} of {totalItemsCount} Done
              </span>
              {progressPercent === 100 ? (
                <span className="text-xs font-bold text-[#4CAF50] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Certified (+20 pts)</span>
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">
                  Complete all for +20 pts
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Switcher Bento Pills */}
        <div className="flex space-x-2.5 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800">
          {WASTE_CHECKLISTS.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const catDoneCount = cat.items.filter((i) => !!completedItems[i.id]).length;
            const isCatAllDone = catDoneCount === cat.items.length;

            return (
              <button
                key={cat.id}
                id={`checklist-tab-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                  isSelected
                    ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-md scale-[1.02]"
                    : "bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title.split("(")[0].trim()}</span>
                {isCatAllDone ? (
                  <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                ) : (
                  <span className="text-[10px] opacity-75 font-semibold">
                    ({catDoneCount}/{cat.items.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Checklist Card & Items */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white flex items-center space-x-2.5">
              <span>{activeCategoryData.icon}</span>
              <span>{activeCategoryData.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {activeCategoryData.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={resetCurrentCategory}
              className="px-3.5 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              title="Reset checkmarks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* List of Step Items */}
        <div className="space-y-3">
          {activeCategoryData.items.map((item, idx) => {
            const isChecked = !!completedItems[item.id];
            return (
              <div
                key={item.id}
                id={`check-item-${item.id}`}
                onClick={() => toggleCheck(item.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-4 group ${
                  isChecked
                    ? "bg-green-50/70 dark:bg-green-950/20 border-green-300 dark:border-green-800 text-slate-800 dark:text-slate-200"
                    : "bg-[#F1F5F9]/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-[#2196F3]/60 hover:bg-white dark:hover:bg-slate-800"
                }`}
              >
                <button type="button" className="mt-1 text-[#4CAF50] shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-[#4CAF50] text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 group-hover:text-[#2196F3]" />
                  )}
                </button>

                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-400">
                      Step #{idx + 1}
                    </span>
                    <h3 className={`text-sm sm:text-base font-black ${isChecked ? "line-through text-slate-500 dark:text-slate-400" : "text-[#0F172A] dark:text-white"}`}>
                      {item.title}
                    </h3>
                    {item.critical && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-800">
                        Critical Rule
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {item.description}
                  </p>

                  {item.tip && (
                    <div className="pt-2 flex items-start space-x-1.5 text-xs text-[#2196F3] font-semibold">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{item.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
