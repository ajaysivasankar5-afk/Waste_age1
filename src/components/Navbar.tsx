import React from "react";
import { 
  Recycle, 
  Camera, 
  BookOpen, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Award,
  Sparkles
} from "lucide-react";
import { REGIONAL_GUIDELINES } from "../data/regionalRules";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  auditCount: number;
  ecoPoints: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegionId,
  setSelectedRegionId,
  auditCount,
  ecoPoints,
}) => {
  const currentRegion = REGIONAL_GUIDELINES.find((r) => r.id === selectedRegionId) || REGIONAL_GUIDELINES[0];

  const navItems = [
    { id: "scanner", label: "AI Scanner", icon: Camera, badge: "Core" },
    { id: "catalog", label: "Waste Catalog", icon: Recycle, badge: "60+ Items" },
    { id: "rules", label: "Regional Rules", icon: MapPin },
    { id: "schedule", label: "Schedule & Alerts", icon: Calendar },
    { id: "tips", label: "Recycling Guide", icon: BookOpen },
    { id: "report", label: "Report Dumping", icon: AlertTriangle },
    { id: "audit", label: "Waste Audit", icon: BarChart3, badge: auditCount > 0 ? `${auditCount}` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("scanner")}>
            <div className="w-11 h-11 rounded-2xl bg-[#0F172A] dark:bg-white dark:text-[#0F172A] text-white flex items-center justify-center shadow-md shadow-slate-900/10">
              <Recycle className="w-6 h-6 text-[#2196F3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black tracking-tight text-[#0F172A] dark:text-white">
                  EcoSort<span className="text-[#2196F3]">.</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-[#2196F3] dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  <Sparkles className="w-3 h-3 mr-1" /> PS-14
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                Waste Intelligence & Categorization System
              </p>
            </div>
          </div>

          {/* Right Status Pill & Actions */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            {/* Live Status Pill */}
            <div className="hidden lg:flex bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-full shadow-sm border border-slate-200/80 dark:border-slate-800 text-xs font-semibold items-center text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 bg-[#4CAF50] rounded-full mr-2 animate-pulse shadow-sm shadow-green-500/50"></span>
              Scanner Ready
            </div>

            {/* Region Selector */}
            <div className="relative">
              <select
                id="region-selector"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="appearance-none bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold py-2 pl-3 pr-8 rounded-full border border-slate-200 dark:border-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2196F3] shadow-sm transition-colors"
                title="Select your local municipal guideline standard"
              >
                {REGIONAL_GUIDELINES.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.flag} {reg.name.split("(")[0].trim()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Eco Points Pill */}
            <div 
              onClick={() => setActiveTab("audit")}
              className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-full cursor-pointer hover:border-[#4CAF50] shadow-sm transition-all group"
              title="Your household eco-points score"
            >
              <Award className="w-4 h-4 text-[#4CAF50] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {ecoPoints} <span className="font-bold text-slate-400">pts</span>
              </span>
            </div>

            {/* Quick New Scan Action Button */}
            <button
              onClick={() => setActiveTab("scanner")}
              className="bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 px-4 sm:px-5 py-2 rounded-full shadow-md text-xs font-black tracking-wider uppercase transition-all hidden sm:inline-flex items-center space-x-1.5 active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-[#2196F3]" />
              <span>New Scan +</span>
            </button>
          </div>
        </div>

        {/* Scrollable Bento Nav Pills */}
        <div className="flex space-x-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-200/60 dark:border-slate-800/60 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-md shadow-slate-900/10 scale-[1.02]"
                    : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2196F3]" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      isActive
                        ? "bg-[#2196F3] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
