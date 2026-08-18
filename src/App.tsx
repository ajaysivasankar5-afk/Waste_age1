/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ScannerView } from "./components/ScannerView";
import { ClassificationResult } from "./components/ClassificationResult";
import { CatalogView } from "./components/CatalogView";
import { RegionalRulesView } from "./components/RegionalRulesView";
import { ScheduleView } from "./components/ScheduleView";
import { ReportDumpView } from "./components/ReportDumpView";
import { HistoryAuditView } from "./components/HistoryAuditView";
import { TipsView } from "./components/TipsView";
import { WasteItem, WasteAuditEntry } from "./types";
import { REGIONAL_GUIDELINES } from "./data/regionalRules";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("scanner");
  const [selectedRegionId, setSelectedRegionId] = useState<string>(() => {
    return localStorage.getItem("waste_region_id") || "standard-intl";
  });

  const [activeResult, setActiveResult] = useState<WasteItem | null>(null);

  const [auditEntries, setAuditEntries] = useState<WasteAuditEntry[]>(() => {
    const saved = localStorage.getItem("waste_audit_entries");
    return saved ? JSON.parse(saved) : [];
  });

  const [ecoPoints, setEcoPoints] = useState<number>(() => {
    const saved = localStorage.getItem("waste_eco_points");
    return saved ? parseInt(saved, 10) : 40;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("waste_region_id", selectedRegionId);
  }, [selectedRegionId]);

  useEffect(() => {
    localStorage.setItem("waste_audit_entries", JSON.stringify(auditEntries));
  }, [auditEntries]);

  useEffect(() => {
    localStorage.setItem("waste_eco_points", ecoPoints.toString());
  }, [ecoPoints]);

  const currentRegion =
    REGIONAL_GUIDELINES.find((r) => r.id === selectedRegionId) || REGIONAL_GUIDELINES[0];

  const handleClassify = (item: WasteItem) => {
    setActiveResult(item);
    setActiveTab("scanner");
  };

  const handleSaveToAudit = (item: WasteItem) => {
    const isDiverted = item.category !== "Landfill";
    const newEntry: WasteAuditEntry = {
      id: `audit-${Date.now()}`,
      itemName: item.name,
      category: item.category,
      material: item.material,
      timestamp: Date.now(),
      photoUrl: item.photoUrl,
      divertedFromLandfill: isDiverted,
    };

    setAuditEntries((prev) => [newEntry, ...prev]);
    setEcoPoints((prev) => prev + 10);
  };

  const handleRemoveAuditEntry = (id: string) => {
    setAuditEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAudit = () => {
    if (window.confirm("Are you sure you want to clear your waste audit history?")) {
      setAuditEntries([]);
    }
  };

  const isCurrentResultSaved = !!(
    activeResult &&
    auditEntries.some((e) => e.itemName === activeResult.name && Math.abs(e.timestamp - (activeResult.timestamp || 0)) < 60000)
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] text-[#1E293B] dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#2196F3] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegionId={selectedRegionId}
        setSelectedRegionId={setSelectedRegionId}
        auditCount={auditEntries.length}
        ecoPoints={ecoPoints}
      />

      {/* Main App Bento Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "scanner" && (
          <>
            {activeResult ? (
              <ClassificationResult
                item={activeResult}
                onReset={() => setActiveResult(null)}
                onSaveToAudit={handleSaveToAudit}
                isSaved={isCurrentResultSaved}
              />
            ) : (
              <ScannerView
                onClassify={handleClassify}
                selectedRegionName={currentRegion.name}
              />
            )}
          </>
        )}

        {activeTab === "catalog" && (
          <CatalogView onSelectItem={handleClassify} />
        )}

        {activeTab === "rules" && (
          <RegionalRulesView
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
          />
        )}

        {activeTab === "schedule" && <ScheduleView />}

        {activeTab === "tips" && <TipsView />}

        {activeTab === "report" && <ReportDumpView />}

        {activeTab === "audit" && (
          <HistoryAuditView
            auditEntries={auditEntries}
            onClearAudit={handleClearAudit}
            onRemoveEntry={handleRemoveAuditEntry}
            ecoPoints={ecoPoints}
          />
        )}
      </main>

      {/* Bento-style Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] shadow-sm animate-pulse" />
            <span className="font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              EcoSort<span className="text-[#2196F3]">.</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-slate-600 dark:text-slate-400">
              Waste Intelligence & Categorization System (PS-14)
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("rules")}
              className="hover:text-[#2196F3] transition-colors"
            >
              Municipal Standard: {currentRegion.name.split("(")[0].trim()}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setActiveTab("tips")}
              className="hover:text-[#2196F3] transition-colors"
            >
              Zero-Waste Masterclasses
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
