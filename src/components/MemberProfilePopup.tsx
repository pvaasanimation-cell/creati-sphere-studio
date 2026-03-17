import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Users, Calendar } from "lucide-react";
import type { MemberProfile } from "@/contexts/AuthContext";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

interface MemberProfilePopupProps {
  member: MemberProfile | null;
  onClose: () => void;
}

const MemberProfilePopup = ({ member, onClose }: MemberProfilePopupProps) => (
  <AnimatePresence>
    {member && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={transition}
          onClick={(e) => e.stopPropagation()}
          className="glass-strong rounded-2xl max-w-md w-full overflow-hidden relative border-glow"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full bg-primary/10 blur-[80px]" />

          <div className="p-8 relative z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl gradient-bg-purple-cyan mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-3xl"
              >
                {member.name[0]?.toUpperCase()}
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
              <p className="text-primary font-medium mt-1">@{member.username}</p>
              {member.online && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">Online now</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {member.country && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
                  <Globe size={16} className="text-muted-foreground" />
                  <div>
                    <span className="text-xs text-muted-foreground">Location</span>
                    <p className="text-sm text-foreground">{member.country}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
                <Users size={16} className="text-muted-foreground" />
                <div>
                  <span className="text-xs text-muted-foreground">Role</span>
                  <p className="text-sm text-foreground">{member.work}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
                <Calendar size={16} className="text-muted-foreground" />
                <div>
                  <span className="text-xs text-muted-foreground">Joined</span>
                  <p className="text-sm text-foreground">
                    {new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              {member.bio && (
                <div className="px-4 py-3 rounded-xl bg-muted/30">
                  <span className="text-xs text-muted-foreground">Bio</span>
                  <p className="text-sm text-foreground mt-1">{member.bio}</p>
                </div>
              )}
            </div>

            {member.featured && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  ★ Featured Creator
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default MemberProfilePopup;
