import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  MapPin, 
  Award,
  Recycle,
  LogIn,
  UserPlus
} from "lucide-react";
import { UserProfile } from "../types";
import { DEMO_USERS } from "../data/defaultUsers";

interface LoginViewProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onClose?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  onLogin,
  onClose,
}) => {
  const [mode, setMode] = useState<"login" | "signup" | "demo">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Sector 4 - Eco Ward");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const user: UserProfile = existing || {
      id: `user-${Date.now()}`,
      name: name || email.split("@")[0],
      email: email,
      role: "Eco Citizen",
      avatar: "🌱",
      district: district,
      ecoPoints: 60,
      joinedDate: "Today",
      streakDays: 1,
    };

    setSuccessMessage(`Welcome back, ${user.name}!`);
    setTimeout(() => {
      onLogin(user);
    }, 600);
  };

  const handleSelectDemo = (demoUser: UserProfile) => {
    setSuccessMessage(`Signed in as ${demoUser.name} (${demoUser.role})`);
    setTimeout(() => {
      onLogin(demoUser);
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Bento Grid Header Tile */}
      <div className="bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Household & Municipal Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Citizen Authentication<span className="text-[#2196F3]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Access your personalized waste audit history, customized pickup schedules, municipal reward badges, and compliance records.
            </p>
          </div>

          {/* Current Profile Summary if already logged in */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-2xl shadow-sm">
                {currentUser.avatar}
              </div>
              <div>
                <span className="text-xs font-black text-[#0F172A] dark:text-white block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] font-bold text-[#2196F3] uppercase tracking-wider block">
                  {currentUser.role} • {currentUser.ecoPoints} pts
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 1-Click Fast Demo Accounts */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>Instant Demo Profiles</span>
              </span>
              <span className="text-[10px] bg-blue-50 text-[#2196F3] dark:bg-blue-950/60 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-bold">
                1-Click Access
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Select a pre-configured profile to explore citizen features, municipal inspection badges, and eco points:
            </p>

            <div className="space-y-2.5">
              {DEMO_USERS.map((demo) => {
                const isSelected = currentUser?.id === demo.id;
                return (
                  <button
                    key={demo.id}
                    id={`demo-user-btn-${demo.id}`}
                    onClick={() => handleSelectDemo(demo)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group hover:scale-[1.01] ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-[#2196F3] text-[#0F172A] dark:text-white shadow-sm"
                        : "bg-[#F1F5F9]/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-[#2196F3]/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-2xl w-9 h-9 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs shrink-0">
                        {demo.avatar}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-black text-[#0F172A] dark:text-white truncate">
                            {demo.name}
                          </span>
                          {isSelected && (
                            <CheckCircle className="w-3.5 h-3.5 text-[#4CAF50] shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                          {demo.role} • {demo.district}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-black text-[#4CAF50] block">
                        {demo.ecoPoints}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        pts
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
            <span className="font-bold flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-[#4CAF50]" />
              <span>Eco Reward Benefits</span>
            </span>
            <p className="text-[11px] leading-relaxed font-medium">
              Every verified waste classification earns +10 Eco Points redeemable for municipal utility credits and compost bag discounts.
            </p>
          </div>
        </div>

        {/* Right Column: Custom Email / Password Login & Registration Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0F172A] rounded-[2rem] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none space-y-6">
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <button
              id="tab-login-btn"
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                mode === "login"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              id="tab-signup-btn"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                mode === "signup"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-950/50 border border-green-300 dark:border-green-800 text-green-900 dark:text-green-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleCustomLogin} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ajay Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Residential District / Ward
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="signup-district"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Greenwood Sector 4"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#2196F3] focus:ring-[#2196F3]"
                />
                <span>Remember this session</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Password reset instructions sent to your email.")}
                className="text-[#2196F3] font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>{mode === "login" ? "Sign In to EcoSort" : "Register Account"}</span>
              <ArrowRight className="w-4 h-4 text-[#2196F3]" />
            </button>
          </form>

          {onClose && (
            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Continue as Anonymous Citizen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
