import React from "react";
import { MapPin, Phone, AlertTriangle, Check, X, Info } from "lucide-react";
import { RegionGuideline } from "../types";
import { REGIONAL_GUIDELINES } from "../data/regionalRules";

interface RegionalRulesViewProps {
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
}

export const RegionalRulesView: React.FC<RegionalRulesViewProps> = ({
  selectedRegionId,
  onSelectRegion,
}) => {
  const currentRegion =
    REGIONAL_GUIDELINES.find((r) => r.id === selectedRegionId) || REGIONAL_GUIDELINES[0];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Municipal Compliance Database
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
              <MapPin className="w-7 h-7 text-[#2196F3]" />
              <span>Local Municipal Waste Guidelines</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
              Recycling rules and bin color standards vary drastically across regions. Select your municipality to view verified container streams and accepted materials.
            </p>
          </div>
        </div>

        {/* Region Selector Bento Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          {REGIONAL_GUIDELINES.map((region) => {
            const isSelected = region.id === currentRegion.id;
            return (
              <button
                key={region.id}
                id={`region-btn-${region.id}`}
                onClick={() => onSelectRegion(region.id)}
                className={`p-4 rounded-[1.5rem] border-2 text-left transition-all space-y-1.5 ${
                  isSelected
                    ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] border-[#0F172A] dark:border-white shadow-lg shadow-slate-900/10 scale-[1.02]"
                    : "bg-[#F1F5F9] dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                }`}
              >
                <div className="text-2xl">{region.flag}</div>
                <p className="text-xs font-black tracking-tight leading-tight">
                  {region.name.split("(")[0].trim()}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Region Detail Bento Card */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{currentRegion.flag}</span>
              <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
                {currentRegion.name}<span className="text-[#2196F3]">.</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium pt-1">
              {currentRegion.description}
            </p>
          </div>

          {currentRegion.hotline && (
            <div className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 self-start sm:self-auto shadow-sm">
              <Phone className="w-4 h-4 text-[#2196F3]" />
              <span>{currentRegion.hotline}</span>
            </div>
          )}
        </div>

        {/* Color-Coded Bins Bento Grid */}
        <div className="space-y-4">
          <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">
            Container Streams & Accepted Items
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {currentRegion.bins.map((bin, index) => (
              <div
                key={index}
                className="rounded-[1.75rem] p-6 border-2 border-slate-200/80 dark:border-slate-800 bg-[#F1F5F9]/50 dark:bg-slate-800/40 space-y-4 relative overflow-hidden shadow-sm"
              >
                {/* Top colored header strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{ backgroundColor: bin.color }}
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: bin.color }}
                    />
                    <h5 className="font-black text-base text-[#0F172A] dark:text-white">
                      {bin.name}
                    </h5>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-sm">
                    {bin.category}
                  </span>
                </div>

                {/* Accepted List */}
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#4CAF50] flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Accepted Items</span>
                  </span>
                  <ul className="space-y-1 pl-1">
                    {bin.acceptedItems.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2 font-medium">
                        <span className="text-[#4CAF50] font-bold text-xs">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prohibited List */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#F44336] flex items-center space-x-1.5">
                    <X className="w-3.5 h-3.5" />
                    <span>Strictly Prohibited</span>
                  </span>
                  <ul className="space-y-1 pl-1">
                    {bin.prohibitedItems.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-500 dark:text-slate-400 flex items-start space-x-2 font-medium">
                        <span className="text-[#F44336] font-bold text-xs">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Local Rules Banner */}
        {currentRegion.specialRules && currentRegion.specialRules.length > 0 && (
          <div className="p-5 sm:p-6 rounded-[1.5rem] bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2.5">
            <span className="font-black text-[#2196F3] flex items-center space-x-1.5 text-xs sm:text-sm uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Key Municipal Directives for {currentRegion.name.split("(")[0].trim()}</span>
            </span>
            <ul className="space-y-1.5 pl-2">
              {currentRegion.specialRules.map((rule, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start space-x-2 font-medium">
                  <span className="text-[#2196F3] font-black">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
