import React, { useState } from "react";
import { 
  Recycle, 
  Upload,
  BookOpen, 
  Calendar, 
  MapPin, 
  AlertTriangle, 
  BarChart3, 
  Award,
  Sparkles,
  ListChecks,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Lock
} from "lucide-react";
import { REGIONAL_GUIDELINES } from "../data/regionalRules";
import { UserProfile } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRegionId: string;
  setSelectedRegionId: (id: string) => void;
  auditCount: number;
  ecoPoints: number;
  currentUser: UserProfile | null;
  onOpenLogin?: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegionId,
  setSelectedRegionId,
  auditCount,
  ecoPoints,
  currentUser,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const currentRegion =
    REGIONAL_GUIDELINES.find((r) => r.id === selectedRegionId) || REGIONAL_GUIDELINES[0];

  // Mask email for user privacy (e.g., a****@domain.com)
  const getMaskedEmail = (email: string) => {
    if (!email) return "Private User";
    const parts = email.split("@");
    if (parts.length !== 2) return email;
    const namePart = parts[0];
    const maskedName = namePart.length > 2 ? `${namePart[0]}***${namePart[namePart.length - 1]}` : `${namePart[0]}*`;
    return `${maskedName}@${parts[1]}`;
  };

  const navItems = [
    { id: "upload", label: "Upload Photo", icon: Upload, badge: "Identify" },
    { id: "catalog", label: "Waste Catalog", icon: Recycle, badge: "60+ Items" },
    { id: "checklists", label: "Segregation Checklists", icon: ListChecks, badge: "Daily" },
    { id: "rules", label: "Regional Rules", icon: MapPin },
    { id: "schedule", label: "Pickup Schedule", icon: Calendar },
    { id: "tips", label: "Recycling Guide", icon: BookOpen },
    { id: "report", label: "Report Dumping", icon: AlertTriangle },
    { id: "audit", label: "Waste Audit", icon: BarChart3, badge: auditCount > 0 ? `${auditCount}` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveTab("upload")}
          >
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
              {currentRegion.flag} {currentRegion.name.split("(")[0].trim()}
            </div>

            {/* Region Selector */}
            <div className="relative hidden sm:block">
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

            {/* Private User Profile Button */}
            {currentUser && (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-2 pr-3 py-1.5 rounded-full hover:border-[#2196F3] shadow-sm transition-all text-xs font-bold"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm shadow-xs">
                    {currentUser.avatar || "🌱"}
                  </span>
                  <span className="hidden md:inline font-black text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in">
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] dark:bg-slate-800 flex items-center justify-center text-xl shadow-xs">
                        {currentUser.avatar || "🌱"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[#0F172A] dark:text-white truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate">
                          {getMaskedEmail(currentUser.email)}
                        </p>
                        <div className="flex items-center space-x-1 mt-0.5">
                          <span className="text-[9px] font-black uppercase text-[#2196F3] tracking-wider">
                            {currentUser.role}
                          </span>
                          <span className="text-[8px] bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 px-1.5 py-0.2 rounded font-bold">
                            Private
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-bold">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400 py-0.5">
                        <span>Citizen ID:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                          {currentUser.citizenId || "ECO-PRIV-SECURE"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400 py-0.5">
                        <span>District:</span>
                        <span className="text-slate-800 dark:text-slate-200">{currentUser.district}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400 py-0.5">
                        <span>Eco Points:</span>
                        <span className="text-[#4CAF50] font-black">{ecoPoints} pts</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center space-x-2 text-[10px] text-blue-800 dark:text-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#2196F3] shrink-0" />
                        <span>All reports & audits are private</span>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onLogout();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-xs font-bold text-red-600 dark:text-red-400 text-left transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Lock & Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Upload Photo Action Button */}
            <button
              onClick={() => setActiveTab("upload")}
              className="bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 px-4 sm:px-5 py-2 rounded-full shadow-md text-xs font-black tracking-wider uppercase transition-all hidden sm:inline-flex items-center space-x-1.5 active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#2196F3]" />
              <span>Upload Photo</span>
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
