import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Search, X, Trophy } from "lucide-react";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const allMembers = [
  { name: "Rahul", role: "Animator", country: "India", online: true, featured: true, score: 1250, bio: "Lead animator with 8 years of experience in character animation." },
  { name: "Ahmed", role: "Designer", country: "UAE", online: true, featured: true, score: 1100, bio: "Visual designer specializing in motion graphics and brand identity." },
  { name: "Sarah", role: "Editor", country: "UK", online: true, featured: true, score: 980, bio: "Post-production expert with a keen eye for storytelling." },
  { name: "Yuki", role: "Developer", country: "Japan", online: false, featured: false, score: 870, bio: "Creative developer building immersive web experiences." },
  { name: "Carlos", role: "Animator", country: "Brazil", online: true, featured: false, score: 820, bio: "2D animator passionate about frame-by-frame artistry." },
  { name: "Nina", role: "Designer", country: "Germany", online: false, featured: false, score: 760, bio: "UI/UX designer creating seamless interactive experiences." },
  { name: "Kofi", role: "Animator", country: "Ghana", online: true, featured: false, score: 700, bio: "Motion graphics artist with a unique African-inspired style." },
  { name: "Mei", role: "Developer", country: "China", online: false, featured: false, score: 650, bio: "Full-stack developer specializing in WebGL and Three.js." },
];

const roles = ["All", "Animator", "Designer", "Editor", "Developer"];

const activityFeed = [
  { text: "Rahul uploaded a new animation", time: "2 min ago" },
  { text: "Ahmed joined PVAAS", time: "15 min ago" },
  { text: "Sarah updated her profile", time: "1 hour ago" },
  { text: "Yuki completed a project", time: "3 hours ago" },
];

const Community = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selected, setSelected] = useState<typeof allMembers[0] | null>(null);

  const filtered = allMembers.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const onlineCount = allMembers.filter((m) => m.online).length;
  const leaderboard = [...allMembers].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="noise-bg pt-32">
      <section className="py-[10vh]">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="text-center mb-12">
            <span className="text-interface text-primary mb-4 block">Community</span>
            <h1 className="text-display text-4xl md:text-6xl text-foreground mb-6">
              The <span className="gradient-purple-cyan">Collective</span>
            </h1>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <AnimatedCounter end={allMembers.length} label="Members" />
            <AnimatedCounter end={new Set(allMembers.map((m) => m.country)).size} label="Countries" />
            <AnimatedCounter end={48} label="Projects" />
            <AnimatedCounter end={onlineCount} label="Online Now" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Members */}
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search members..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg glass bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        roleFilter === r
                          ? "gradient-bg-purple-cyan text-primary-foreground"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((m) => (
                    <motion.div
                      key={m.name}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelected(m)}
                      className="cursor-pointer"
                    >
                      <GlassCard className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground font-bold">
                            {m.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground truncate">{m.name}</h3>
                              {m.featured && <span className="text-accent text-xs">★</span>}
                            </div>
                            <p className="text-xs text-primary">{m.role}</p>
                            <p className="text-xs text-muted-foreground">{m.country}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${m.online ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"}`} />
                            <span className="text-xs text-muted-foreground">{m.online ? "Online" : "Offline"}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Online */}
              <GlassCard className="p-5" hover={false}>
                <h3 className="text-interface text-primary mb-4">Online Now</h3>
                <div className="space-y-3">
                  {allMembers.filter((m) => m.online).map((m) => (
                    <div key={m.name} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm text-foreground">{m.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{m.country}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Leaderboard */}
              <GlassCard className="p-5" hover={false}>
                <h3 className="text-interface text-primary mb-4 flex items-center gap-2">
                  <Trophy size={14} /> Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboard.map((m, i) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-5 ${i < 3 ? "text-accent" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground flex-1">{m.name}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{m.score}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Activity */}
              <GlassCard className="p-5" hover={false}>
                <h3 className="text-interface text-primary mb-4">Activity Feed</h3>
                <div className="space-y-3">
                  {activityFeed.map((a, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">{a.text}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl max-w-md w-full p-8 text-center"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
              <div className="w-20 h-20 rounded-full gradient-bg-purple-cyan mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-2xl">
                {selected.name[0]}
              </div>
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-primary text-sm mt-1">{selected.role}</p>
              <p className="text-muted-foreground text-xs mt-1">{selected.country}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${selected.online ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                <span className="text-xs text-muted-foreground">{selected.online ? "Online" : "Offline"}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{selected.bio}</p>
              <div className="mt-4 flex justify-center gap-4 text-sm">
                <div>
                  <span className="text-foreground font-bold tabular-nums">{selected.score}</span>
                  <span className="text-muted-foreground ml-1">Score</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
