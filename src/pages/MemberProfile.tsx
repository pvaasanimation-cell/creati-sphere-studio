import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Users, Calendar, ArrowLeft, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GlassCard from "@/components/GlassCard";
import type { MemberProfile as MemberProfileType } from "@/contexts/AuthContext";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

const MemberProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("username", username ?? "")
        .single();
      if (data) setMember(data as MemberProfileType);
      setLoading(false);
    };
    fetchMember();
  }, [username]);

  if (loading) {
    return (
      <div className="noise-bg pt-32 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="noise-bg pt-32 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Member not found</p>
        <button onClick={() => navigate("/members")} className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Members
        </button>
      </div>
    );
  }

  return (
    <div className="noise-bg pt-32 min-h-screen">
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition}
          onClick={() => navigate("/members")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Members
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
          <GlassCard className="p-8 border-glow relative overflow-hidden" hover={false}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[250px] rounded-full bg-primary/10 blur-[100px]" />

            <div className="relative z-10">
              {/* Avatar & Name */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-24 h-24 rounded-2xl mx-auto mb-5 overflow-hidden"
                >
                  {member.avatar_url ? (
                    <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground font-bold text-4xl">
                      {member.name[0]?.toUpperCase()}
                    </div>
                  )}
                </motion.div>

                <h1 className="text-3xl font-bold text-foreground">{member.name}</h1>
                <p className="text-primary font-medium mt-1 text-lg">@{member.username}</p>

                {member.online && (
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-green-400">Online now</span>
                  </div>
                )}

                {member.featured && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                      <Star size={14} /> Featured Creator
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-3">
                {member.bio && (
                  <div className="px-5 py-4 rounded-xl bg-muted/30">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Bio</span>
                    <p className="text-foreground mt-2 leading-relaxed">{member.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.country && (
                    <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-muted/30">
                      <Globe size={18} className="text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground">Location</span>
                        <p className="text-sm text-foreground">{member.country}{member.city ? `, ${member.city}` : ""}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-muted/30">
                    <Users size={18} className="text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground">Role</span>
                      <p className="text-sm text-foreground">{member.work || "Member"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-muted/30">
                    <Calendar size={18} className="text-muted-foreground shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground">Joined</span>
                      <p className="text-sm text-foreground">
                        {new Date(member.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default MemberProfile;
