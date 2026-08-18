import React, { useState } from "react";
import { Search, Filter, Sparkles, ChevronRight, X, Volume2, CheckCircle2, AlertOctagon } from "lucide-react";
import { WasteItem, WasteCategory } from "../types";
import { WASTE_CATALOG, CATEGORY_COLORS } from "../data/wasteCatalog";

interface CatalogViewProps {
  onSelectItem: (item: WasteItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ onSelectItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [inspectItem, setInspectItem] = useState<WasteItem | null>(null);

  const categories: ("All" | WasteCategory)[] = ["All", "Recyclable", "Organic", "Hazardous", "Landfill"];

  const filteredItems = WASTE_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#2196F3]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Verified Waste Database
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Waste Segregation Catalog<span className="text-[#2196F3]">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Explore 60+ household items with verified disposal steps, material composition, and municipal stream rules.
            </p>
          </div>

          <span className="text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 self-start sm:self-auto border border-slate-200 dark:border-slate-700 shadow-sm">
            {filteredItems.length} of {WASTE_CATALOG.length} items
          </span>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by name, material, or keyword..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-md shadow-slate-900/10 scale-[1.02]"
                      : "bg-[#F1F5F9] dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Catalog Bento Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#0F172A] rounded-[2rem] border border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-base font-black text-slate-800 dark:text-slate-200">
            No items matched "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Try searching for materials like "plastic", "paper", "battery", or "glass".
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-5 py-2.5 bg-[#0F172A] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredItems.map((item) => {
            const borderStyle =
              item.category === "Recyclable"
                ? "hover:border-[#2196F3] border-[#2196F3]/20"
                : item.category === "Organic"
                ? "hover:border-[#4CAF50] border-[#4CAF50]/20"
                : item.category === "Hazardous"
                ? "hover:border-[#F44336] border-[#F44336]/20"
                : "hover:border-slate-400 border-slate-200 dark:border-slate-800";

            return (
              <div
                key={item.id}
                id={`catalog-item-${item.id}`}
                onClick={() => setInspectItem(item)}
                className={`bg-white dark:bg-[#0F172A] rounded-[1.75rem] p-6 border-2 ${borderStyle} shadow-lg shadow-slate-200/40 dark:shadow-none transition-all cursor-pointer flex flex-col justify-between group space-y-4 hover:-translate-y-1`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      item.category === "Recyclable" ? "bg-[#2196F3] text-white" :
                      item.category === "Organic" ? "bg-[#4CAF50] text-white" :
                      item.category === "Hazardous" ? "bg-[#F44336] text-white" :
                      "bg-slate-700 text-white"
                    }`}>
                      {item.category}
                    </span>
                    <span className="text-lg">
                      {item.category === "Recyclable" && "♻️"}
                      {item.category === "Organic" && "🌱"}
                      {item.category === "Hazardous" && "⚠️"}
                      {item.category === "Landfill" && "🗑️"}
                    </span>
                  </div>

                  <h3 className="font-black text-[#0F172A] dark:text-white text-base group-hover:text-[#2196F3] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {item.instructions}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                    {item.binName}
                  </span>
                  <span className="text-[#2196F3] font-black uppercase text-[10px] tracking-wider flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Item Bento Modal */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] max-w-lg w-full p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectItem(null)}
              className="absolute right-5 top-5 p-2 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                inspectItem.category === "Recyclable" ? "bg-[#2196F3] text-white" :
                inspectItem.category === "Organic" ? "bg-[#4CAF50] text-white" :
                inspectItem.category === "Hazardous" ? "bg-[#F44336] text-white" :
                "bg-slate-700 text-white"
              }`}>
                {inspectItem.category}
              </span>
              <h3 className="text-2xl font-black text-[#0F172A] dark:text-white tracking-tight">
                {inspectItem.name}<span className="text-[#2196F3]">.</span>
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                Material composition: {inspectItem.material}
              </p>
            </div>

            {/* Disposal Bin Card */}
            <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Recommended Disposal Location
              </span>
              <p className="text-base font-black text-[#0F172A] dark:text-white">
                {inspectItem.binName}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
                {inspectItem.instructions}
              </p>
            </div>

            {/* Preparation Steps */}
            {inspectItem.preparationSteps && inspectItem.preparationSteps.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-slate-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  <span>Preparation Checklist:</span>
                </span>
                <ul className="space-y-1.5 pl-2">
                  {inspectItem.preparationSteps.map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] mt-1.5 shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contamination Warning */}
            {inspectItem.contaminationWarning && (
              <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#F44336] flex items-center space-x-1">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Contamination Alert</span>
                </span>
                <p className="text-xs text-red-900 dark:text-red-300 font-medium">
                  {inspectItem.contaminationWarning}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onSelectItem(inspectItem);
                  setInspectItem(null);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-black tracking-wider uppercase shadow-md transition-all active:scale-95"
              >
                Full Analysis & Voice Readout
              </button>
              <button
                onClick={() => setInspectItem(null)}
                className="py-3 px-5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
