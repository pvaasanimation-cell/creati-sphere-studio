import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, Shield, ArrowRight } from "lucide-react";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

const EntryGate = () => {
  const navigate = useNavigate();

  const handleChoice = (mode: string) => {
    navigate(`/auth?mode=${mode}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background"
    >
      <div className="gradient-bg-subtle absolute inset-0" />
      <div className="absolute inset-0 noise-bg" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...transition, delay: 0.2 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="w-16 h-16 rounded-2xl gradient-bg-purple-cyan mx-auto mb-6 flex items-center justify-center overflow-hidden"
          >
            <img src="/favicon.ico" alt="PVAAS" className="w-10 h-10 object-contain" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.4 }}
            className="text-display text-3xl text-foreground mb-2"
          >
            Welcome to <span className="gradient-purple-cyan">PVAAS</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...transition, delay: 0.5 }}
            className="text-muted-foreground"
          >
            Are you a?
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transition, delay: 0.5 }}
            onClick={() => handleChoice("signup")}
            className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <UserPlus size={22} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">New Here</h3>
              <p className="text-sm text-muted-foreground">Join the PVAAS community</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transition, delay: 0.6 }}
            onClick={() => handleChoice("login")}
            className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <LogIn size={22} className="text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Member</h3>
              <p className="text-sm text-muted-foreground">Login to your account</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground group-hover:text-secondary transition-colors" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transition, delay: 0.7 }}
            onClick={() => handleChoice("admin-login")}
            className="glass glass-hover rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Shield size={22} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Owner</h3>
              <p className="text-sm text-muted-foreground">Admin access</p>
            </div>
            <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent transition-colors" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EntryGate;
