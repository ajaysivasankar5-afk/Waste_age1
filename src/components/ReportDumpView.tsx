import React, { useState } from "react";
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle, 
  Clock, 
  ShieldAlert,
  ThumbsUp
} from "lucide-react";
import confetti from "canvas-confetti";
import { DumpingReport } from "../types";
import { INITIAL_COMMUNITY_REPORTS } from "../data/defaultSchedules";

export const ReportDumpView: React.FC = () => {
  const [reports, setReports] = useState<DumpingReport[]>(() => {
    const saved = localStorage.getItem("dumping_reports");
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_REPORTS;
  });

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<DumpingReport["category"]>("Illegal Dumping");
  const [severity, setSeverity] = useState<DumpingReport["severity"]>("Medium");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [reporterName, setReporterName] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !description) return;

    const newReport: DumpingReport = {
      id: `rep-${Date.now()}`,
      title,
      location,
      category,
      severity,
      description,
      photoUrl,
      reporterName: reporterName || "Concerned Citizen",
      status: "Pending Investigation",
      timestamp: Date.now(),
    };

    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("dumping_reports", JSON.stringify(updated));

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    setSubmittedSuccess(true);
    setTitle("");
    setLocation("");
    setDescription("");
    setPhotoUrl(undefined);
    setReporterName("");

    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  const handleUpvote = (id: string) => {
    setUpvotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bento Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#F44336]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Citizen Action & Safety
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight flex items-center space-x-2.5">
          <AlertTriangle className="w-7 h-7 text-[#F44336]" />
          <span>Community Dumping & Hazard Reporting</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Report illegal waste dumping, chemical spills, or overflowing public collection bins to alert local sanitation teams and community monitors.
        </p>
      </div>

      {submittedSuccess && (
        <div className="p-5 rounded-[1.75rem] bg-green-50 dark:bg-green-950/50 border-2 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200 flex items-center space-x-3.5 animate-in fade-in">
          <CheckCircle className="w-6 h-6 text-[#4CAF50] shrink-0" />
          <div className="text-xs sm:text-sm space-y-0.5">
            <span className="font-black block">Incident Report Successfully Dispatched!</span>
            <span className="font-medium">Your report has been logged and forwarded to municipal monitoring. Thank you for protecting our environment.</span>
          </div>
        </div>
      )}

      {/* Two-Column Bento Layout: Report Form & Local Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Bento Tile */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-5 h-fit">
          <h3 className="font-black text-lg text-[#0F172A] dark:text-white flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-[#2196F3]" />
            <span>Submit Incident Report</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                Incident Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., 5 discarded vehicle tires by canal"
                className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                Location / Address *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="E.g., Oak Street & 4th Avenue"
                  className="w-full pl-9 pr-3 p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  required
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DumpingReport["category"])}
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                >
                  <option value="Illegal Dumping">Illegal Dumping</option>
                  <option value="Overflowing Public Bin">Overflowing Bin</option>
                  <option value="Hazardous Spill">Hazardous Spill</option>
                  <option value="Uncollected Waste">Uncollected Waste</option>
                </select>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                  Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as DumpingReport["severity"])}
                  className="w-full p-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-xs"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                Description & Impact *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the items, approximate quantity, and any immediate hazard..."
                rows={3}
                className="w-full p-3.5 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium resize-none"
                required
              />
            </div>

            <div>
              <label className="block font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[10px] mb-1.5">
                Attach Photo Evidence (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950/60 dark:file:text-blue-300 cursor-pointer"
              />
              {photoUrl && (
                <div className="mt-2 relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <img src={photoUrl} alt="Evidence preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Submit Public Report</span>
            </button>
          </form>
        </div>

        {/* Reports Feed Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-[#0F172A] dark:text-white">
              Recent Community Reports ({reports.length})
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live feed</span>
          </div>

          <div className="space-y-3">
            {reports.map((rep) => {
              const count = upvotes[rep.id] || 0;
              return (
                <div
                  key={rep.id}
                  className="bg-white dark:bg-[#0F172A] rounded-[1.75rem] p-5 sm:p-6 border-2 border-slate-200/80 dark:border-slate-800 shadow-md shadow-slate-200/30 dark:shadow-none space-y-3 transition-all hover:border-[#2196F3]/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                          rep.severity === "Critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                            : rep.severity === "High"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                        }`}>
                          {rep.severity} Severity
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {rep.category}
                        </span>
                      </div>
                      <h4 className="font-black text-[#0F172A] dark:text-white text-base">
                        {rep.title}
                      </h4>
                    </div>

                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap ${
                      rep.status === "Resolved"
                        ? "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300"
                        : rep.status === "Dispatched Cleanup"
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {rep.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#2196F3]" />
                      <span>{rep.location}</span>
                    </span>

                    <button
                      onClick={() => handleUpvote(rep.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider transition-colors"
                      title="Verify/Upvote report"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-[#2196F3]" />
                      <span>Confirm {count > 0 ? `(${count})` : ""}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
