import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the URL token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="noise-bg min-h-screen flex items-center justify-center p-6 relative">
      <div className="gradient-bg-subtle absolute inset-0" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <GlassCard className="p-8" hover={false}>
          <h2 className="text-display text-2xl text-foreground mb-1">Reset Password</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your new password</p>
          {!ready ? (
            <p className="text-muted-foreground text-center">Verifying reset link...</p>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                required
                minLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Set New Password"}
              </button>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
