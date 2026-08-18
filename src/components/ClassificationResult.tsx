import React, { useState } from "react";
import { 
  CheckCircle2, 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Save, 
  Sparkles, 
  Clock, 
  Leaf, 
  CheckSquare, 
  Square,
  Share2,
  HelpCircle
} from "lucide-react";
import confetti from "canvas-confetti";
import { WasteItem, WasteCategory } from "../types";
import { CATEGORY_COLORS } from "../data/wasteCatalog";

interface ClassificationResultProps {
  item: WasteItem;
  onReset: () => void;
  onSaveToAudit: (item: WasteItem) => void;
  isSaved: boolean;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({
  item,
  onReset,
  onSaveToAudit,
  isSaved,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showShareToast, setShowShareToast] = useState(false);

  const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Landfill;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [index]: !prev[index] };
      // Check if all steps are completed
      if (item.preparationSteps && Object.keys(next).length === item.preparationSteps.length && Object.values(next).every(Boolean)) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#10B981", "#3B82F6", "#F59E0B"],
        });
      }
      return next;
    });
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${item.name}. Category: ${item.category}. Bin: ${item.binName}. Instructions: ${item.instructions}. Warning: ${item.contaminationWarning}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSave = () => {
    if (isSaved) return;
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#16A34A", "#2563EB", "#F59E0B"],
    });
    onSaveToAudit(item);
  };

  const handleShare = () => {
    const text = `I just classified "${item.name}" as ${item.category} (${item.binName}) using the Waste Segregation Assistant!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    }
  };

  const getCategoryBadgeClass = (category: WasteCategory) => {
    switch (category) {
      case "Recyclable":
        return "bg-blue-600 text-white";
      case "Organic":
        return "bg-emerald-600 text-white";
      case "Hazardous":
        return "bg-red-600 text-white animate-pulse";
      case "Landfill":
      default:
        return "bg-slate-700 text-white";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Top Banner Bento Card */}
      <div 
        className="rounded-[2rem] p-6 sm:p-10 border-2 shadow-2xl relative overflow-hidden transition-all bg-white dark:bg-[#0F172A]"
        style={{ borderColor: item.color || colors.hex }}
      >
        {/* Subtle decorative glow watermark */}
        <div 
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: item.color || colors.hex }}
        />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${getCategoryBadgeClass(item.category)}`}>
                {item.category}
              </span>
              {item.confidence && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {Math.round(item.confidence * 100)}% Confidence
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Material: {item.material}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight pt-1">
              {item.name}<span className="text-[#2196F3]">.</span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {item.instructions}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2.5 self-start shrink-0">
            <button
              id="voice-readout-btn"
              onClick={handleSpeak}
              className={`px-4 py-2.5 rounded-full border transition-all flex items-center space-x-2 text-xs font-bold ${
                isSpeaking
                  ? "bg-amber-500 text-white border-amber-600 shadow-md"
                  : "bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
              }`}
              title="Listen to disposal instructions"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeaking ? "Mute" : "Voice Readout"}</span>
            </button>

            <button
              id="share-result-btn"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
              title="Copy details to clipboard"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showShareToast && (
          <div className="mt-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 dark:border-emerald-800 text-center font-bold animate-in fade-in">
            Copied segregation summary to clipboard!
          </div>
        )}

        {/* Primary Bin Destination Bento Box */}
        <div className="mt-8 p-5 sm:p-6 rounded-[1.5rem] bg-[#F1F5F9] dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-2xl shrink-0"
              style={{ backgroundColor: item.color || colors.hex }}
            >
              {item.category === "Recyclable" && "♻️"}
              {item.category === "Organic" && "🌱"}
              {item.category === "Hazardous" && "⚠️"}
              {item.category === "Landfill" && "🗑️"}
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Recommended Disposal Bin
              </span>
              <span className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white">
                {item.binName}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="save-audit-btn"
              onClick={handleSave}
              disabled={isSaved}
              className={`px-6 py-3 rounded-full text-xs font-black tracking-wider uppercase flex items-center space-x-2 transition-all ${
                isSaved
                  ? "bg-green-100 text-green-800 dark:bg-green-950/80 dark:text-green-300 border border-green-300 dark:border-green-800 cursor-default"
                  : "bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] shadow-lg shadow-slate-900/10 active:scale-95"
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Logged (+10 pts)</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#2196F3]" />
                  <span>Log in My Waste Audit</span>
                </>
              )}
            </button>

            <button
              id="scan-another-btn"
              onClick={onReset}
              className="px-5 py-3 rounded-full text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-2 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Scan Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Preparation Checklist & Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-step Preparation Checklist Bento Card */}
        <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#0F172A] dark:text-white flex items-center space-x-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
              <span>Preparation Checklist</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Zero Contamination
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Complete each step before disposal to safeguard the recycling stream:
          </p>

          <div className="space-y-2.5 pt-1">
            {item.preparationSteps && item.preparationSteps.length > 0 ? (
              item.preparationSteps.map((step, idx) => {
                const checked = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    id={`prep-step-${idx}`}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start space-x-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      checked
                        ? "bg-green-50/80 dark:bg-green-950/30 border-green-300 dark:border-green-800 text-slate-800 dark:text-slate-200"
                        : "bg-[#F1F5F9]/60 dark:bg-slate-800/40 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <button type="button" className="mt-0.5 text-[#4CAF50] shrink-0">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 fill-[#4CAF50] text-white" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <span className={`text-sm ${checked ? "line-through text-slate-400 font-medium" : "font-semibold"}`}>
                      {step}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">No special preparation required. Dispose directly into bin.</p>
            )}
          </div>

          {/* Expert Pro Tip */}
          {item.tips && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-xs text-blue-900 dark:text-blue-300 space-y-1 mt-4">
              <span className="font-black uppercase tracking-wider flex items-center space-x-1.5 text-[#2196F3]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expert Segregation Tip</span>
              </span>
              <p className="leading-relaxed font-medium">{item.tips}</p>
            </div>
          )}
        </div>

        {/* Contamination Warning & Impact Metrics Bento Tile */}
        <div className="space-y-6">
          {/* Contamination Hazard Alert */}
          {item.contaminationWarning && (
            <div className="bg-red-50 dark:bg-red-950/40 border-2 border-red-200 dark:border-red-800/60 rounded-[2rem] p-6 shadow-sm space-y-2">
              <div className="flex items-center space-x-2 text-[#F44336] font-black text-sm uppercase tracking-wider">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <span>Contamination Warning</span>
              </div>
              <p className="text-xs sm:text-sm text-red-900 dark:text-red-300 leading-relaxed font-medium">
                {item.contaminationWarning}
              </p>
            </div>
          )}

          {/* Ecological Impact & Decomposition Bento Card */}
          <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-4">
            <h3 className="font-black text-[#0F172A] dark:text-white flex items-center space-x-2 text-base">
              <Leaf className="w-5 h-5 text-[#4CAF50]" />
              <span>Environmental & Landfill Impact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Landfill Lifespan</span>
                </span>
                <p className="text-sm font-black text-[#0F172A] dark:text-slate-200">
                  {item.decompositionTime || "Varies by conditions"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-green-50/80 dark:bg-green-950/30 border border-green-200 dark:border-green-800/60 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#4CAF50] flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Segregation Benefit</span>
                </span>
                <p className="text-xs font-semibold text-green-900 dark:text-green-300 leading-snug">
                  {item.environmentalImpact || "Diverts valuable resources from municipal landfills."}
                </p>
              </div>
            </div>

            {/* Why This Category Card */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-300 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Why is this classified as {item.category}?</span>
              </span>
              <p className="leading-relaxed font-medium">
                {item.category === "Recyclable" && "This item consists of recoverable polymers, metals, glass, or fibers that can be melted, repulped, and manufactured into new products."}
                {item.category === "Organic" && "This item is composed of natural biological matter that decomposes through aerobic bacterial action into nutrient-rich soil humus."}
                {item.category === "Hazardous" && "This item contains chemical compounds, heavy metals, or pressurized gases that pose fire, toxicity, or environmental risks if compacted."}
                {item.category === "Landfill" && "This item contains mixed non-separable polymers or non-recyclable materials that cannot be mechanically recovered at current facilities."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
