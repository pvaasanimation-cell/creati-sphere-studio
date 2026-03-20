import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, UserPlus, LogIn, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

type AuthMode = "gate" | "signup" | "login" | "admin-login";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get("mode") as AuthMode) || "gate";
  const [mode, setMode] = useState<AuthMode>(
    ["signup", "login", "admin-login"].includes(initialMode) ? initialMode : "gate"
  );
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, { name: name.trim(), username: username.trim(), country: country.trim() });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome to PVAAS Animation!");
      navigate("/");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate("/");
    }
  };

  return (
    <div className="noise-bg min-h-screen flex items-center justify-center p-6 relative">
      <div className="gradient-bg-subtle absolute inset-0" />

      <AnimatePresence mode="wait">
        {mode === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={transition}
            className="relative z-10 w-full max-w-md"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl gradient-bg-purple-cyan mx-auto mb-6 flex items-center justify-center overflow-hidden">
                <img src="/favicon.ico" alt="PVAAS" className="w-10 h-10 object-contain" />
              </div>
              <h1 className="text-display text-3xl text-foreground mb-2">
                Welcome to <span className="gradient-purple-cyan">PVAAS</span>
              </h1>
              <p className="text-muted-foreground">Are you a?</p>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => setMode("signup")} className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UserPlus size={22} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">New Here</h3>
                  <p className="text-sm text-muted-foreground">Join the PVAAS community</p>
                </div>
                <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </button>

              <button onClick={() => setMode("login")} className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <LogIn size={22} className="text-secondary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Member</h3>
                  <p className="text-sm text-muted-foreground">Login to your account</p>
                </div>
                <ArrowRight size={18} className="text-muted-foreground group-hover:text-secondary transition-colors" />
              </button>

              <button onClick={() => setMode("admin-login")} className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Shield size={22} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Owner</h3>
                  <p className="text-sm text-muted-foreground">Admin access</p>
                </div>
                <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
              </button>
            </div>
          </motion.div>
        )}

        {mode === "signup" && (
          <motion.div key="signup" initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={transition} className="relative z-10 w-full max-w-md">
            <button onClick={() => setMode("gate")} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">← Back</button>
            <GlassCard className="p-8" hover={false}>
              <h2 className="text-display text-2xl text-foreground mb-1">Join PVAAS</h2>
              <p className="text-sm text-muted-foreground mb-6">Create your account to join the community</p>
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <input type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required maxLength={100} />
                <input type="text" placeholder="Username *" value={username} onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required maxLength={30} />
                <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required maxLength={255} />
                <input type="password" placeholder="Password * (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required minLength={6} />
                <input type="text" placeholder="Country / City" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" maxLength={100} />
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 disabled:opacity-50">
                  {loading ? "Creating..." : "Join PVAAS Studio"}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}

        {(mode === "login" || mode === "admin-login") && (
          <motion.div key={mode} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={transition} className="relative z-10 w-full max-w-md">
            <button onClick={() => setMode("gate")} className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">← Back</button>
            <GlassCard className="p-8" hover={false}>
              <h2 className="text-display text-2xl text-foreground mb-1">{mode === "admin-login" ? "Owner Login" : "Member Login"}</h2>
              <p className="text-sm text-muted-foreground mb-6">{mode === "admin-login" ? "Access admin dashboard" : "Welcome back to the studio"}</p>
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required maxLength={255} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" required />
                <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 ${mode === "admin-login" ? "bg-accent text-accent-foreground hover:shadow-[0_0_40px_rgba(245,158,11,0.3)]" : "gradient-bg-purple-cyan text-primary-foreground hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]"}`}>
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Auth;
