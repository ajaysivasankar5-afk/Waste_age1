/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { PhotoUploadView } from "./components/PhotoUploadView";
import { ClassificationResult } from "./components/ClassificationResult";
import { CatalogView } from "./components/CatalogView";
import { RegionalRulesView } from "./components/RegionalRulesView";
import { ScheduleView } from "./components/ScheduleView";
import { ReportDumpView } from "./components/ReportDumpView";
import { HistoryAuditView } from "./components/HistoryAuditView";
import { TipsView } from "./components/TipsView";
import { ChecklistsView } from "./components/ChecklistsView";
import { LoginView } from "./components/LoginView";
import { WasteItem, WasteAuditEntry, UserProfile } from "./types";
import { REGIONAL_GUIDELINES } from "./data/regionalRules";

export default function App() {
  // Check if there is an active authenticated private session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("waste_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>("upload");

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
    return saved ? parseInt(saved, 10) : currentUser ? currentUser.ecoPoints : 150;
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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("waste_auth_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("waste_auth_user");
    }
  }, [currentUser]);

  const currentRegion =
    REGIONAL_GUIDELINES.find((r) => r.id === selectedRegionId) || REGIONAL_GUIDELINES[0];

  const handleClassify = (item: WasteItem) => {
    setActiveResult(item);
  };

  const handleOverrideResult = (newItem: WasteItem) => {
    setActiveResult(newItem);
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
      userId: currentUser?.id,
    };

    setAuditEntries((prev) => [newEntry, ...prev]);
    setEcoPoints((prev) => prev + 10);
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, ecoPoints: prev.ecoPoints + 10 } : null));
    }
  };

  const handleEarnPoints = (pts: number) => {
    setEcoPoints((prev) => prev + pts);
    if (currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, ecoPoints: prev.ecoPoints + pts } : null));
    }
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setEcoPoints(user.ecoPoints || 150);
    setActiveTab("upload");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveResult(null);
    localStorage.removeItem("waste_auth_user");
  };

  const handleRemoveAuditEntry = (id: string) => {
    setAuditEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearAudit = () => {
    if (window.confirm("Are you sure you want to clear your private waste audit history?")) {
      setAuditEntries([]);
    }
  };

  const handleSelectTab = (tab: string) => {
    setActiveResult(null);
    setActiveTab(tab);
  };

  const isCurrentResultSaved = !!(
    activeResult &&
    auditEntries.some(
      (e) =>
        e.itemName === activeResult.name &&
        Math.abs(e.timestamp - (activeResult.timestamp || 0)) < 60000
    )
  );

  // 1. FIRST SCREEN: If user is not authenticated, show ONLY the Login Gateway
  if (!currentUser) {
    return (
      <LoginView
        currentUser={null}
        onLogin={handleLogin}
      />
    );
  }

  // 2. REMAINING PAGES: Render complete application only after login
  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] text-[#1E293B] dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-[#2196F3] selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        selectedRegionId={selectedRegionId}
        setSelectedRegionId={setSelectedRegionId}
        auditCount={auditEntries.length}
        ecoPoints={ecoPoints}
        currentUser={currentUser}
        onOpenLogin={() => {}}
        onLogout={handleLogout}
      />

      {/* Main App Bento Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "upload" && (
          <>
            {activeResult ? (
              <ClassificationResult
                item={activeResult}
                onReset={() => setActiveResult(null)}
                onSaveToAudit={handleSaveToAudit}
                isSaved={isCurrentResultSaved}
                onOverrideItem={handleOverrideResult}
              />
            ) : (
              <PhotoUploadView
                onClassify={handleClassify}
                selectedRegionName={currentRegion.name}
              />
            )}
          </>
        )}

        {activeTab === "catalog" && (
          <>
            {activeResult ? (
              <ClassificationResult
                item={activeResult}
                onReset={() => setActiveResult(null)}
                onSaveToAudit={handleSaveToAudit}
                isSaved={isCurrentResultSaved}
                onOverrideItem={handleOverrideResult}
              />
            ) : (
              <CatalogView onSelectItem={handleClassify} />
            )}
          </>
        )}

        {activeTab === "checklists" && (
          <ChecklistsView onEarnPoints={handleEarnPoints} />
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
              Private Citizen Session • {currentUser.citizenId || "ID-ENCRYPTED"}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-semibold">
            <button
              onClick={() => handleSelectTab("checklists")}
              className="hover:text-[#2196F3] transition-colors"
            >
              Segregation Checklists
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => handleSelectTab("schedule")}
              className="hover:text-[#2196F3] transition-colors"
            >
              Pickup Reminders
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => handleSelectTab("rules")}
              className="hover:text-[#2196F3] transition-colors"
            >
              Municipal Standard: {currentRegion.name.split("(")[0].trim()}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
