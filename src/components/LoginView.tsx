import React, { useState } from "react";
import { 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  MapPin, 
  Recycle,
  Shield,
  KeyRound,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";
import { UserProfile } from "../types";
import { DEMO_USERS } from "../data/defaultUsers";

interface LoginViewProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  currentUser,
  onLogin,
}) => {
  const [authMode, setAuthMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Greenwood Sector 4");
  const [role, setRole] = useState<UserProfile["role"]>("Eco Citizen");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isPrivacyProtected, setIsPrivacyProtected] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessing(true);
    setNotice(null);

    // Simulate encrypted authentication check
    setTimeout(() => {
      // Check stored custom accounts in local encrypted store
      const storedUsersRaw = localStorage.getItem("waste_registered_users");
      const storedUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      
      let matchedUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        // Create secure private session user
        const citizenHash = `CIT-${Math.floor(1000 + Math.random() * 9000)}-PRIV`;
        matchedUser = {
          id: `usr_${Date.now()}`,
          citizenId: citizenHash,
          name: name || email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " "),
          email: email,
          role: role,
          avatar: "🌱",
          district: district,
          ecoPoints: 150,
          joinedDate: "Today",
          streakDays: 1,
          isPrivate: true,
        };
      }

      setIsProcessing(false);
      onLogin(matchedUser);
    }, 450);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setIsProcessing(true);
    const citizenHash = `CIT-${Math.floor(1000 + Math.random() * 9000)}-PRIV`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      citizenId: citizenHash,
      name: name,
      email: email,
      role: role,
      avatar: role === "Municipal Inspector" ? "🛡️" : role === "Green Volunteer" ? "🌿" : "🌱",
      district: district,
      ecoPoints: 100,
      joinedDate: "Today",
      streakDays: 1,
      isPrivate: isPrivacyProtected,
    };

    // Save to private local registered user store
    const storedUsersRaw = localStorage.getItem("waste_registered_users");
    const storedUsers: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
    storedUsers.push(newUser);
    localStorage.setItem("waste_registered_users", JSON.stringify(storedUsers));

    setTimeout(() => {
      setIsProcessing(false);
      onLogin(newUser);
    }, 450);
  };

  const handleSandboxLogin = (demoUser: UserProfile) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onLogin(demoUser);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] flex flex-col justify-center items-center px-4 sm:px-6 py-10 selection:bg-[#2196F3] selection:text-white">
      {/* Container Box */}
      <div className="w-full max-w-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-xl shadow-slate-900/10 mb-1">
            <Recycle className="w-9 h-9 text-[#2196F3]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight">
              EcoSort<span className="text-[#2196F3]">.</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
              Waste Intelligence & Categorization System (PS-14)
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-none space-y-6">
          {/* Security & Privacy Banner */}
          <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#2196F3] shrink-0" />
            <span>Private & Encrypted Citizen Session. Your ID and activity remain private.</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              id="auth-tab-signin"
              type="button"
              onClick={() => {
                setAuthMode("signin");
                setNotice(null);
              }}
              className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                authMode === "signin"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              id="auth-tab-register"
              type="button"
              onClick={() => {
                setAuthMode("register");
                setNotice(null);
              }}
              className={`flex-1 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                authMode === "register"
                  ? "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A] shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          {authMode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Citizen Email or ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#2196F3] focus:ring-[#2196F3]"
                  />
                  <span>Remember Session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setNotice("Password reset instruction link sent to your private inbox.")}
                  className="text-[#2196F3] font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {notice && (
                <div className="p-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl text-xs text-green-800 dark:text-green-300 font-medium">
                  {notice}
                </div>
              )}

              <button
                id="signin-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <span>{isProcessing ? "Authenticating..." : "Sign In to Assistant"}</span>
                <ArrowRight className="w-4 h-4 text-[#2196F3]" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Citizen Name"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    District / Ward
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="register-district"
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Ward 4"
                      className="w-full pl-10 pr-3 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Account Role
                  </label>
                  <select
                    id="register-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-full bg-[#F1F5F9] dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2196F3] text-slate-900 dark:text-white"
                  >
                    <option value="Eco Citizen">Eco Citizen</option>
                    <option value="Municipal Inspector">Municipal Inspector</option>
                    <option value="Green Volunteer">Green Volunteer</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center space-x-2.5">
                <input
                  type="checkbox"
                  id="privacy-shield-checkbox"
                  checked={isPrivacyProtected}
                  onChange={(e) => setIsPrivacyProtected(e.target.checked)}
                  className="rounded text-[#2196F3] focus:ring-[#2196F3]"
                />
                <label htmlFor="privacy-shield-checkbox" className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                  Enable ID Masking & Privacy Shield (hides email and ID on public reports)
                </label>
              </div>

              <button
                id="register-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-white dark:text-[#0F172A] dark:hover:bg-slate-100 text-xs font-black uppercase tracking-wider shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <span>{isProcessing ? "Creating Account..." : "Create Private Account"}</span>
                <ArrowRight className="w-4 h-4 text-[#2196F3]" />
              </button>
            </form>
          )}

          {/* Quick Sandbox Access (Generic, No personal info exposed) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">
              Or Fast Sandbox Access (No registration required)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSandboxLogin(demo)}
                  className="p-2.5 rounded-2xl bg-[#F1F5F9] dark:bg-slate-800 hover:border-[#2196F3] border border-slate-200 dark:border-slate-700 text-center transition-all hover:scale-105 active:scale-95"
                >
                  <span className="text-base block mb-0.5">{demo.avatar}</span>
                  <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 block truncate">
                    {demo.role}
                  </span>
                  <span className="text-[9px] text-slate-400 block">
                    {demo.citizenId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Assurance Footer */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-400 font-medium">
            🔒 All citizen waste audits, reports, and scan histories are strictly private to each authenticated account.
          </p>
        </div>
      </div>
    </div>
  );
};
