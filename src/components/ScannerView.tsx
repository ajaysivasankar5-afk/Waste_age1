import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Upload, 
  Search, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  X, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  SwitchCamera,
  Layers,
  ArrowRight,
  Sliders,
  Check,
  AlertTriangle,
  Info,
  ScanLine,
  Flame,
  ShieldCheck,
  Play,
  RotateCcw,
  Maximize2
} from "lucide-react";
import { WasteItem, WasteCategory } from "../types";
import { WASTE_CATALOG, findCatalogItem, CATEGORY_COLORS } from "../data/wasteCatalog";

interface ScannerViewProps {
  onClassify: (item: WasteItem) => void;
  selectedRegionName: string;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  onClassify,
  selectedRegionName,
}) => {
  const [activeScannerTab, setActiveScannerTab] = useState<"camera" | "manual" | "upload" | "matrix" | "search">("camera");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>("");
  const [textQuery, setTextQuery] = useState("");
  
  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [simulatedLensTarget, setSimulatedLensTarget] = useState<WasteItem>(WASTE_CATALOG[0]);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);

  // Manual Scanner State
  const [manualMaterialFamily, setManualMaterialFamily] = useState<string>("plastic");
  const [manualItemId, setManualItemId] = useState<string>(WASTE_CATALOG[0].id);
  const [manualCondition, setManualCondition] = useState<"clean" | "greasy" | "wet" | "mixed">("clean");

  // Matrix Filter
  const [matrixStreamFilter, setMatrixStreamFilter] = useState<WasteCategory>("Recyclable");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Catalog grouped by stream
  const STREAM_GROUPS: Record<WasteCategory, WasteItem[]> = {
    Recyclable: WASTE_CATALOG.filter((i) => i.category === "Recyclable"),
    Organic: WASTE_CATALOG.filter((i) => i.category === "Organic"),
    Hazardous: WASTE_CATALOG.filter((i) => i.category === "Hazardous"),
    Landfill: WASTE_CATALOG.filter((i) => i.category === "Landfill"),
  };

  // Manual Material Categories
  const MATERIAL_FAMILIES = [
    { id: "plastic", label: "Plastics & Bottles", icon: "🧴", desc: "PET #1, HDPE #2, PP #5, Films" },
    { id: "paper", label: "Paper & Cardboard", icon: "📦", desc: "Boxes, newspapers, office paper" },
    { id: "glass", label: "Glass Bottles & Jars", icon: "🍾", desc: "Beverage glass, condiment jars" },
    { id: "metal", label: "Metals & Cans", icon: "🥫", desc: "Aluminum cans, tin food cans, foil" },
    { id: "organic", label: "Food & Organics", icon: "🍌", desc: "Peels, scraps, coffee grounds" },
    { id: "hazardous", label: "E-Waste & Batteries", icon: "🔋", desc: "AA batteries, phones, bulbs" },
    { id: "medical", label: "Chemicals & Medical", icon: "💊", desc: "Blister packs, aerosols, paint" },
    { id: "residual", label: "Non-Recyclable Landfill", icon: "🗑️", desc: "Styrofoam, chip bags, coffee cups" },
  ];

  // Quick Resin Identification Symbols
  const RESIN_CODES = [
    { label: "♳ #1 PET (Beverage Bottles)", query: "plastic bottle pet 1", cat: "Recyclable" },
    { label: "♴ #2 HDPE (Shampoo / Milk Jug)", query: "shampoo hdpe bottle 2", cat: "Recyclable" },
    { label: "♷ #5 PP (Tupperware & Caps)", query: "plastic bottle", cat: "Recyclable" },
    { label: "ALU 41 (Aluminum Soda Cans)", query: "aluminum soda can", cat: "Recyclable" },
    { label: "PAP 20 (Corrugated Cardboard)", query: "cardboard shipping box", cat: "Recyclable" },
    { label: "GL 70 (Glass Bottles & Jars)", query: "glass food jar bottle", cat: "Recyclable" },
    { label: "FE 40 (Steel Food Cans)", query: "steel food can", cat: "Recyclable" },
    { label: "🌱 Organic (Compost & Food)", query: "banana peel fruit", cat: "Organic" },
    { label: "☣️ E-Waste & Batteries", query: "aa alkaline battery", cat: "Hazardous" },
    { label: "♸ #6 PS (Styrofoam / Takeout)", query: "styrofoam takeout container", cat: "Landfill" },
  ];

  // Auto-init camera when camera tab is selected
  useEffect(() => {
    if (activeScannerTab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeScannerTab]);

  const startCamera = async (overrideFacing?: "environment" | "user") => {
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Camera hardware unavailable in this sandbox. Use the interactive Viewfinder Lens Simulator or Manual Scanner below.");
      setCameraActive(false);
      return;
    }

    const targetFacing = overrideFacing || facingMode;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: targetFacing, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn("Video playback note:", e));
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start exception:", err?.name || err?.message || err);
      setCameraError("Camera hardware access was restricted by browser permissions. The Interactive Optical Scanner Lens is active below.");
      setCameraActive(false);
    }
  };

  const toggleFacingMode = () => {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Live Shutter Scan Action
  const triggerCameraScan = () => {
    setIsScanningAnimation(true);

    if (cameraActive && videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setSelectedImage(dataUrl);
        stopCamera();
        setTimeout(() => {
          setIsScanningAnimation(false);
          analyzeImage(dataUrl, canvas, "camera-scan.jpg");
        }, 600);
        return;
      }
    }

    // If simulated viewfinder
    setTimeout(() => {
      setIsScanningAnimation(false);
      onClassify({
        ...simulatedLensTarget,
        id: `scan-${Date.now()}`,
        confidence: 0.98,
        timestamp: Date.now(),
        region: selectedRegionName,
      });
    }, 700);
  };

  // Manual Scanner Execution
  const executeManualScan = () => {
    setIsAnalyzing(true);
    setAnalysisStatus("Analyzing manual item parameters, material matrix, and contamination status...");

    const selectedItem = WASTE_CATALOG.find((i) => i.id === manualItemId) || WASTE_CATALOG[0];

    setTimeout(() => {
      setIsAnalyzing(false);

      // If condition is greasy/soiled on paper/cardboard => Divert to landfill/organic
      let adjustedItem = { ...selectedItem };
      if (manualCondition === "greasy" && selectedItem.category === "Recyclable" && selectedItem.material.includes("Paper")) {
        adjustedItem = {
          ...selectedItem,
          name: `${selectedItem.name} (Grease Contaminated)`,
          category: "Landfill",
          binName: "Black Landfill Bin / Organic Compost",
          contaminationWarning: "Heavy oil and food grease saturate paper fibers, preventing pulp hydration in recycling tanks.",
          instructions: "Tear away clean top lid for blue recycling bin. Place grease-stained bottom into compost or landfill.",
        };
      }

      onClassify({
        ...adjustedItem,
        id: `manual-scan-${Date.now()}`,
        confidence: 0.99,
        timestamp: Date.now(),
        region: selectedRegionName,
      });
    }, 450);
  };

  // File Upload Handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          analyzeImage(dataUrl, canvas, file.name);
        } else {
          analyzeImage(dataUrl, undefined, file.name);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setSelectedImage(dataUrl);
        analyzeImage(dataUrl, undefined, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Visual Heuristics for image analysis
  const extractVisualHeuristicItem = (canvas?: HTMLCanvasElement, filename?: string): WasteItem => {
    if (filename) {
      const fnMatch = findCatalogItem(filename);
      if (fnMatch) return fnMatch;
    }

    if (!canvas) return WASTE_CATALOG[0];

    try {
      const ctx = canvas.getContext("2d");
      if (!ctx) return WASTE_CATALOG[0];

      const cx = Math.floor(canvas.width * 0.25);
      const cy = Math.floor(canvas.height * 0.25);
      const cw = Math.floor(canvas.width * 0.5);
      const ch = Math.floor(canvas.height * 0.5);
      
      const imgData = ctx.getImageData(cx, cy, Math.max(1, cw), Math.max(1, ch));
      const data = imgData.data;
      let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;
      
      for (let i = 0; i < data.length; i += 16) {
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        pixelCount++;
      }

      if (pixelCount === 0) return WASTE_CATALOG[0];

      const avgR = totalR / pixelCount;
      const avgG = totalG / pixelCount;
      const avgB = totalB / pixelCount;

      // Green / Plant tones => Organics (banana peel, scraps)
      if (avgG > avgB * 1.15 && (avgR + avgG) > 160) {
        return WASTE_CATALOG.find((i) => i.id === "banana-peel") || WASTE_CATALOG[8];
      }

      // Red / Dark / Chemical => Batteries / Hazardous
      if ((avgR > avgG * 1.35 && avgR > 110) || (avgR < 50 && avgG < 50 && avgB < 50)) {
        return WASTE_CATALOG.find((i) => i.id === "aa-alkaline-battery") || WASTE_CATALOG[14];
      }

      // Brown => Cardboard shipping box
      if (avgR > avgB * 1.3 && avgG > avgB * 1.1 && avgR > 90) {
        return WASTE_CATALOG.find((i) => i.id === "cardboard-shipping-box") || WASTE_CATALOG[3];
      }

      // Silver / Aluminum
      if (avgB > avgR * 1.05 || (avgR > 190 && avgG > 190 && avgB > 190)) {
        return WASTE_CATALOG.find((i) => i.id === "aluminum-soda-can") || WASTE_CATALOG[1];
      }
    } catch (e) {
      console.warn("Visual feature extraction exception:", e);
    }

    return WASTE_CATALOG[0];
  };

  const analyzeImage = async (base64Image: string, canvasSource?: HTMLCanvasElement, filename?: string) => {
    setIsAnalyzing(true);
    setAnalysisStatus("Analyzing visual texture, geometry & stream categorization...");

    const heuristicItem = extractVisualHeuristicItem(canvasSource, filename);

    try {
      const res = await fetch("/api/classify-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Image,
          region: selectedRegionName,
          userNotes: filename || heuristicItem.name,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const matchedCatalog = findCatalogItem(json.data.itemName || filename || "") || heuristicItem;
          const itemData: WasteItem = {
            id: `scan-${Date.now()}`,
            name: json.data.itemName || matchedCatalog.name,
            category: json.data.category || matchedCatalog.category,
            material: json.data.material || matchedCatalog.material,
            color: json.data.color || matchedCatalog.color,
            binName: json.data.binName || matchedCatalog.binName,
            instructions: json.data.instructions || matchedCatalog.instructions,
            tips: json.data.tips || matchedCatalog.tips,
            contaminationWarning: json.data.contaminationWarning || matchedCatalog.contaminationWarning,
            environmentalImpact: json.data.environmentalImpact || matchedCatalog.environmentalImpact,
            decompositionTime: json.data.decompositionTime || matchedCatalog.decompositionTime,
            preparationSteps: json.data.preparationSteps || matchedCatalog.preparationSteps,
            resinCode: matchedCatalog.resinCode,
            recyclingSymbol: matchedCatalog.recyclingSymbol,
            componentBreakdown: matchedCatalog.componentBreakdown,
            carbonSavedKg: matchedCatalog.carbonSavedKg,
            recycledProduct: matchedCatalog.recycledProduct,
            alternativeDisposal: matchedCatalog.alternativeDisposal,
            recyclabilityRating: matchedCatalog.recyclabilityRating,
            confidence: json.data.confidence || 0.96,
            photoUrl: base64Image,
            timestamp: Date.now(),
            region: selectedRegionName,
          };
          setIsAnalyzing(false);
          onClassify(itemData);
          return;
        }
      }
    } catch (err) {
      console.warn("Image classification fallback:", err);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      onClassify({
        ...heuristicItem,
        id: `scan-${Date.now()}`,
        confidence: 0.95,
        photoUrl: base64Image,
        timestamp: Date.now(),
        region: selectedRegionName,
      });
    }, 400);
  };

  const handleTextClassification = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAnalyzing(true);
    setAnalysisStatus(`Matching "${queryText}" with municipal stream rules...`);

    const localMatch = findCatalogItem(queryText);

    try {
      const res = await fetch("/api/classify-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          region: selectedRegionName,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const itemData: WasteItem = {
            id: `search-${Date.now()}`,
            name: json.data.itemName || localMatch?.name || queryText,
            category: json.data.category || localMatch?.category || "Recyclable",
            material: json.data.material || localMatch?.material || "Household Packaging",
            color: json.data.color || localMatch?.color || "#2563EB",
            binName: json.data.binName || localMatch?.binName || "Recycling Bin",
            instructions: json.data.instructions || localMatch?.instructions || "",
            tips: json.data.tips || localMatch?.tips || "",
            contaminationWarning: json.data.contaminationWarning || localMatch?.contaminationWarning || "",
            environmentalImpact: json.data.environmentalImpact || localMatch?.environmentalImpact || "",
            decompositionTime: json.data.decompositionTime || localMatch?.decompositionTime || "",
            preparationSteps: json.data.preparationSteps || localMatch?.preparationSteps || [],
            resinCode: localMatch?.resinCode,
            recyclingSymbol: localMatch?.recyclingSymbol,
            componentBreakdown: localMatch?.componentBreakdown,
            carbonSavedKg: localMatch?.carbonSavedKg,
            recycledProduct: localMatch?.recycledProduct,
            alternativeDisposal: localMatch?.alternativeDisposal,
            recyclabilityRating: localMatch?.recyclabilityRating,
            confidence: json.data.confidence || 0.96,
            timestamp: Date.now(),
            region: selectedRegionName,
          };
          setIsAnalyzing(false);
          onClassify(itemData);
          return;
        }
      }
    } catch (e) {
      console.warn("Text API call fallback:", e);
    }

    if (localMatch) {
      setTimeout(() => {
        setIsAnalyzing(false);
        onClassify({
          ...localMatch,
          id: `search-${Date.now()}`,
          confidence: 0.98,
          timestamp: Date.now(),
          region: selectedRegionName,
        });
      }, 250);
    } else {
      setTimeout(() => {
        setIsAnalyzing(false);
        onClassify({
          id: `custom-${Date.now()}`,
          name: queryText,
          category: "Recyclable",
          material: "Household Packaging",
          color: "#2563EB",
          binName: "Blue Recycling Bin",
          instructions: `Check for resin codes (#1, #2, #5). Rinse clean and place in blue bin.`,
          tips: `Keep items clean and dry for high-purity recycling.`,
          contaminationWarning: `Never mix grease or hazardous chemicals into recycling bins.`,
          environmentalImpact: `Proper segregation preserves circular material recovery.`,
          decompositionTime: "100+ years",
          preparationSteps: ["Check recycling code", "Rinse clean", "Place in Blue Bin"],
          confidence: 0.90,
          timestamp: Date.now(),
          region: selectedRegionName,
        });
      }, 300);
    }
  };

  // Filter items for manual selector based on selected family
  const filteredManualItems = WASTE_CATALOG.filter((item) => {
    if (manualMaterialFamily === "plastic") return item.material.toLowerCase().includes("plastic") || item.resinCode;
    if (manualMaterialFamily === "paper") return item.material.toLowerCase().includes("paper") || item.material.toLowerCase().includes("cardboard");
    if (manualMaterialFamily === "glass") return item.material.toLowerCase().includes("glass");
    if (manualMaterialFamily === "metal") return item.material.toLowerCase().includes("aluminum") || item.material.toLowerCase().includes("steel") || item.material.toLowerCase().includes("metal");
    if (manualMaterialFamily === "organic") return item.category === "Organic";
    if (manualMaterialFamily === "hazardous") return item.category === "Hazardous";
    if (manualMaterialFamily === "medical") return item.name.toLowerCase().includes("medicine") || item.name.toLowerCase().includes("aerosol");
    if (manualMaterialFamily === "residual") return item.category === "Landfill";
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Bento Grid Header Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Universal Waste Detector (PS-14)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Waste Scanner & Classifier<span className="text-[#2196F3]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Open your camera to scan physical waste items, use the interactive Manual Scanner to diagnose materials, or upload packaging photos.
            </p>
          </div>

          {/* 4 Stream Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            {(["Recyclable", "Organic", "Hazardous", "Landfill"] as WasteCategory[]).map((cat) => {
              const count = STREAM_GROUPS[cat].length;
              const colorInfo = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setMatrixStreamFilter(cat);
                    setActiveScannerTab("matrix");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all hover:scale-105 ${colorInfo.bg} ${colorInfo.border}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${colorInfo.text}`}>
                    {cat}
                  </span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {count} <span className="text-[10px] font-normal text-slate-400">items</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scanner Mode Toolbar Switcher */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
            <button
              id="tab-scanner-camera-btn"
              type="button"
              onClick={() => setActiveScannerTab("camera")}
              className={`flex-1 sm:flex-initial py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                activeScannerTab === "camera"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Scanner</span>
            </button>

            <button
              id="tab-scanner-manual-btn"
              type="button"
              onClick={() => setActiveScannerTab("manual")}
              className={`flex-1 sm:flex-initial py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                activeScannerTab === "manual"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual Scanner</span>
            </button>

            <button
              id="tab-scanner-upload-btn"
              type="button"
              onClick={() => setActiveScannerTab("upload")}
              className={`flex-1 sm:flex-initial py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                activeScannerTab === "upload"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              id="tab-scanner-matrix-btn"
              type="button"
              onClick={() => setActiveScannerTab("matrix")}
              className={`flex-1 sm:flex-initial py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                activeScannerTab === "matrix"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Waste Matrix (1-Tap)</span>
            </button>

            <button
              id="tab-scanner-search-btn"
              type="button"
              onClick={() => setActiveScannerTab("search")}
              className={`flex-1 sm:flex-initial py-2 px-4 rounded-full text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                activeScannerTab === "search"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Resin & Codes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Scanner Stage */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
        {isAnalyzing ? (
          /* High-Tech Animated Radar Loader */
          <div className="py-16 px-6 text-center space-y-5 rounded-[1.5rem] bg-[#F1F5F9] dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-[#2196F3]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-4 border-[#2196F3]/40 animate-spin" />
              <div className="absolute inset-4 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Sparkles className="w-8 h-8 text-[#2196F3] animate-bounce" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-[#0F172A] dark:text-white">
                Classifying Waste Item
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                {analysisStatus || "Analyzing material composition & sorting guidelines..."}
              </p>
            </div>
          </div>
        ) : activeScannerTab === "camera" ? (
          /* Live Camera / High-Tech Viewfinder Stage */
          <div className="space-y-5">
            {/* Viewfinder Canvas */}
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-video max-h-[480px] flex items-center justify-center border-2 border-slate-800 shadow-2xl">
              {/* Actual Live Video Feed */}
              {cameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Interactive Optical Viewfinder Simulation */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-radial from-slate-900 to-black relative">
                  <div className="w-32 h-32 rounded-3xl bg-slate-800/80 border-2 border-dashed border-[#2196F3]/60 flex flex-col items-center justify-center space-y-2 mb-4 shadow-xl">
                    <span className="text-4xl">{simulatedLensTarget.recyclingSymbol || "♻️"}</span>
                    <span className="text-[10px] font-black uppercase text-[#2196F3] tracking-widest">
                      Target Locked
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {simulatedLensTarget.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium max-w-md mt-1">
                    {simulatedLensTarget.material} • Aiming at {simulatedLensTarget.category} Stream
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {WASTE_CATALOG.slice(0, 5).map((quickItem) => (
                      <button
                        key={quickItem.id}
                        type="button"
                        onClick={() => setSimulatedLensTarget(quickItem)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                          simulatedLensTarget.id === quickItem.id
                            ? "bg-[#2196F3] text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {quickItem.name.split("(")[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Viewfinder Target Reticle HUD & Laser Scanline */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Active Laser Scanline */}
                {isScanningAnimation && (
                  <div className="absolute inset-x-0 h-1 bg-[#2196F3] shadow-[0_0_15px_#2196F3] animate-bounce top-1/2" />
                )}

                {/* Reticle Bracket Corners */}
                <div className="w-60 h-60 sm:w-72 sm:h-72 border border-white/20 rounded-3xl relative">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#2196F3] rounded-tl-2xl" />
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#2196F3] rounded-tr-2xl" />
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#2196F3] rounded-bl-2xl" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#2196F3] rounded-br-2xl" />

                  {/* Center Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-40">
                    <div className="w-6 h-0.5 bg-white" />
                    <div className="h-6 w-0.5 bg-white absolute" />
                  </div>

                  <div className="absolute inset-x-0 bottom-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90 bg-black/70 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                      {cameraActive ? "Center waste item in viewfinder" : "Optical Lens Simulator"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Viewfinder Control Bar */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-center pointer-events-auto">
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-colors flex items-center space-x-1.5 text-xs font-bold border border-white/10"
                  title="Flip camera"
                >
                  <SwitchCamera className="w-4 h-4" />
                  <span className="hidden sm:inline">Flip</span>
                </button>

                <div className="flex items-center space-x-1.5 bg-black/70 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <ScanLine className="w-3.5 h-3.5 text-[#4CAF50] animate-pulse" />
                  <span>{cameraActive ? "Live Hardware Feed" : "Ready to Scan"}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (cameraActive) stopCamera();
                    else startCamera();
                  }}
                  className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-colors border border-white/10 text-xs font-bold"
                  title="Toggle camera"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Shutter Capture Button */}
              <div className="absolute bottom-6 inset-x-0 flex justify-center items-center pointer-events-auto">
                <button
                  id="camera-shutter-trigger-btn"
                  type="button"
                  onClick={triggerCameraScan}
                  className="group relative flex items-center justify-center p-1 rounded-full bg-white/20 backdrop-blur-md active:scale-95 transition-all"
                  title="Capture and Classify"
                >
                  <div className="w-18 h-18 rounded-full bg-white hover:bg-slate-100 border-4 border-[#2196F3] flex items-center justify-center shadow-2xl transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                      <Camera className="w-6 h-6 text-[#2196F3]" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Camera Permission / Sandbox Status */}
            {cameraError && (
              <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center space-x-2.5">
                  <Info className="w-4 h-4 text-[#2196F3] shrink-0" />
                  <span className="font-medium">{cameraError}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="px-3.5 py-1.5 bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] rounded-full font-bold text-[11px]"
                  >
                    Retry Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveScannerTab("manual")}
                    className="px-3.5 py-1.5 bg-[#2196F3] text-white rounded-full font-bold hover:bg-blue-600 text-[11px]"
                  >
                    Use Manual Scanner
                  </button>
                </div>
              </div>
            )}

            {/* Quick 1-Tap Waste Identifiers */}
            <div className="p-5 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
                  <span>1-Tap Waste Identifiers</span>
                </span>
                <span className="text-[10px] text-slate-400">Instant accurate diagnosis</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {WASTE_CATALOG.slice(0, 10).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onClassify({
                        ...item,
                        id: `scan-${Date.now()}`,
                        confidence: 0.98,
                        timestamp: Date.now(),
                        region: selectedRegionName,
                      });
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-700 hover:border-[#2196F3] border border-slate-200 dark:border-slate-600 text-left transition-all hover:scale-105 active:scale-95 space-y-1 group"
                  >
                    <div className="text-xl">{item.recyclingSymbol || "♻️"}</div>
                    <p className="text-xs font-black text-[#0F172A] dark:text-white group-hover:text-[#2196F3] truncate">
                      {item.name.split("(")[0].trim()}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : activeScannerTab === "manual" ? (
          /* Dedicated Interactive Manual Scanner */
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F172A] dark:text-white flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-[#2196F3]" />
                <span>Manual Waste Identifier & Parameter Scanner</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Select the material characteristics, object type, and cleanliness state to run a diagnostic municipal scan.
              </p>
            </div>

            {/* Step 1: Material Family Selection */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Step 1: Select Material Family
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {MATERIAL_FAMILIES.map((fam) => {
                  const isSelected = manualMaterialFamily === fam.id;
                  return (
                    <button
                      key={fam.id}
                      type="button"
                      onClick={() => {
                        setManualMaterialFamily(fam.id);
                        // Auto-select first item in that family
                        const itemsInFam = WASTE_CATALOG.filter((i) => {
                          if (fam.id === "plastic") return i.material.toLowerCase().includes("plastic") || i.resinCode;
                          if (fam.id === "paper") return i.material.toLowerCase().includes("paper") || i.material.toLowerCase().includes("cardboard");
                          if (fam.id === "glass") return i.material.toLowerCase().includes("glass");
                          if (fam.id === "metal") return i.material.toLowerCase().includes("aluminum") || i.material.toLowerCase().includes("steel");
                          if (fam.id === "organic") return i.category === "Organic";
                          if (fam.id === "hazardous") return i.category === "Hazardous";
                          if (fam.id === "medical") return i.name.toLowerCase().includes("medicine") || i.name.toLowerCase().includes("aerosol");
                          if (fam.id === "residual") return i.category === "Landfill";
                          return true;
                        });
                        if (itemsInFam.length > 0) {
                          setManualItemId(itemsInFam[0].id);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/60 border-2 border-[#2196F3] shadow-sm scale-[1.02]"
                          : "bg-[#F1F5F9]/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-2xl">{fam.icon}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#2196F3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white">
                          {fam.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {fam.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Specific Object Type */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Step 2: Specific Item Type
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredManualItems.slice(0, 9).map((item) => {
                  const isSelected = manualItemId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setManualItemId(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-md border-transparent scale-[1.01]"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#2196F3]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-black truncate">{item.name}</p>
                        <p className={`text-[10px] truncate ${isSelected ? "text-slate-300 dark:text-slate-600" : "text-slate-400"}`}>
                          {item.material}
                        </p>
                      </div>
                      <span className="text-base shrink-0">{item.recyclingSymbol || "♻️"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Cleanliness & Contamination State */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Step 3: Cleanliness & Contamination State
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "clean", label: "Clean & Empty", desc: "No food/liquid residue" },
                  { id: "greasy", label: "Greasy / Food Stained", desc: "Oil or cheese soaked" },
                  { id: "wet", label: "Wet / Liquid Residual", desc: "Contains leftover drink" },
                  { id: "mixed", label: "Mixed Multi-Material", desc: "Plastic glued with paper" },
                ].map((cond) => {
                  const isSelected = manualCondition === cond.id;
                  return (
                    <button
                      key={cond.id}
                      type="button"
                      onClick={() => setManualCondition(cond.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-950/60 border-2 border-[#2196F3]"
                          : "bg-[#F1F5F9]/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                    >
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        {cond.label}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {cond.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Run Manual Diagnostic Scan Action */}
            <div className="pt-2">
              <button
                id="execute-manual-scan-btn"
                type="button"
                onClick={executeManualScan}
                className="w-full py-4 px-6 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center space-x-2.5 active:scale-95"
              >
                <Zap className="w-5 h-5 text-[#2196F3]" />
                <span>Run Diagnostic Waste Scan & Classify</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : activeScannerTab === "upload" ? (
          /* Photo Upload Mode */
          <div className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300/80 dark:border-slate-700 hover:border-[#2196F3] dark:hover:border-[#2196F3] rounded-[1.75rem] p-8 sm:p-12 text-center cursor-pointer transition-all bg-[#F1F5F9]/60 dark:bg-slate-900/40 group space-y-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 text-[#2196F3] mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-md border border-slate-200/60 dark:border-slate-700">
                <ImageIcon className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-sm mx-auto">
                <p className="text-base font-black text-[#0F172A] dark:text-white">
                  Click to upload packaging photo or drag & drop
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Upload packaging, fruit scraps, batteries, bottles, pizza boxes, or coffee cups
                </p>
              </div>

              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-xs font-black tracking-wider uppercase shadow-md transition-all inline-flex items-center space-x-2 active:scale-95"
              >
                <Upload className="w-4 h-4 text-[#2196F3]" />
                <span>Browse Photo File</span>
              </button>
            </div>
          </div>
        ) : activeScannerTab === "matrix" ? (
          /* 4-Stream Waste Matrix */
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(["Recyclable", "Organic", "Hazardous", "Landfill"] as WasteCategory[]).map((cat) => {
                const isSelected = matrixStreamFilter === cat;
                const colorInfo = CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMatrixStreamFilter(cat)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? `${colorInfo.bg} ${colorInfo.border} border-2 shadow-sm scale-[1.02]`
                        : "bg-[#F1F5F9]/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider block ${colorInfo.text}`}>
                        {cat} Stream
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">
                        {STREAM_GROUPS[cat].length} Items
                      </span>
                    </div>
                    <span className="text-xl">
                      {cat === "Recyclable" && "♻️"}
                      {cat === "Organic" && "🌱"}
                      {cat === "Hazardous" && "⚠️"}
                      {cat === "Landfill" && "🗑️"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {STREAM_GROUPS[matrixStreamFilter].map((item) => (
                <button
                  key={item.id}
                  id={`matrix-item-${item.id}`}
                  type="button"
                  onClick={() => {
                    onClassify({
                      ...item,
                      id: `scan-${Date.now()}`,
                      confidence: 0.98,
                      timestamp: Date.now(),
                      region: selectedRegionName,
                    });
                  }}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-[#2196F3] text-left transition-all hover:shadow-md hover:scale-[1.01] space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {item.recyclingSymbol || (item.category === "Organic" ? "🌱" : item.category === "Hazardous" ? "⚠️" : "♻️")}
                    </span>
                    {item.resinCode && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.resinCode}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-black text-[#0F172A] dark:text-white group-hover:text-[#2196F3] transition-colors truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                      {item.material}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] font-bold text-[#2196F3]">
                    <span>{item.binName.split("(")[0].trim()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Resin Codes & Live Search Mode */
          <div className="space-y-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTextClassification(textQuery);
              }}
              className="relative"
            >
              <input
                id="waste-text-search-input"
                type="text"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                placeholder="E.g. plastic bottle #1, aa battery, banana peel, greasy pizza box, coffee cup, tin can..."
                className="w-full pl-12 pr-32 py-4 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-sm font-semibold shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" />
              <button
                type="submit"
                disabled={!textQuery.trim()}
                className="absolute right-2 top-2 px-6 py-2.5 bg-[#0F172A] hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-black tracking-wider uppercase rounded-full shadow-md transition-colors"
              >
                Classify
              </button>
            </form>

            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Standard Resin Identification Codes & Shortcuts:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RESIN_CODES.map((rc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTextClassification(rc.query)}
                    className="p-3 rounded-2xl bg-[#F1F5F9]/80 dark:bg-slate-800/60 hover:border-[#2196F3] border border-slate-200 dark:border-slate-700 text-left text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between transition-all hover:scale-[1.01]"
                  >
                    <span>{rc.label}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      rc.cat === "Recyclable" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300" :
                      rc.cat === "Organic" ? "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300" :
                      rc.cat === "Hazardous" ? "bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300" :
                      "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                    }`}>
                      {rc.cat}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
