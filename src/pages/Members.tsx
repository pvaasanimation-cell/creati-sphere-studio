import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import type { MemberProfile } from "@/contexts/AuthContext";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const Members = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [search, setSearch] = useState("");
  const [filterWork, setFilterWork] = useState("All");
  const [loading, setLoading] = useState(true);

  const workTypes = ["All", "Animator", "Designer", "Editor", "Developer", "Member"];

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMembers(data as MemberProfile[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();

    // Realtime subscription
    const channel = supabase
      .channel("members-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const onlineMembers = members.filter((m) => m.online);
  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.username.toLowerCase().includes(search.toLowerCase());
    const matchWork = filterWork === "All" || m.work === filterWork;
    return matchSearch && matchWork;
  });

  return (
    <div className="noise-bg pt-32 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="text-center mb-12">
          <span className="text-interface text-primary mb-4 block">Community</span>
          <h1 className="text-display text-4xl md:text-6xl text-foreground mb-6">
            Our <span className="gradient-purple-cyan">Members</span>
          </h1>
        </motion.div>

        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }} className="mb-10">
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-primary" />
                <span className="text-interface text-primary">Currently Online</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {onlineMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-foreground">{m.name}</span>
                    {m.country && <span className="text-xs text-muted-foreground">– {m.country}</span>}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {workTypes.map((w) => (
              <button
                key={w}
                onClick={() => setFilterWork(w)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterWork === w
                    ? "gradient-bg-purple-cyan text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Members Grid */}
        {loading ? (
          <div className="text-center text-muted-foreground py-20">Loading members...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No members found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...transition, delay: Math.min(i * 0.05, 0.5) }}
              >
                <GlassCard className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                      {m.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{m.name}</h3>
                        {m.online && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">@{m.username}</p>
                      {m.country && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Globe size={12} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{m.country}</span>
                        </div>
                      )}
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{m.work}</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...transition, delay: 0.3 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          {members.length} members • {onlineMembers.length} online • {new Set(members.map(m => m.country).filter(Boolean)).size} countries
        </motion.div>
      </div>
    </div>
  );
};

export default Members;
