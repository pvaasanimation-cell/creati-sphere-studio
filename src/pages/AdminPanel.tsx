import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Trash2, Star, Download, Users, Globe, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import type { MemberProfile } from "@/contexts/AuthContext";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const AdminPanel = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    if (data) setMembers(data as MemberProfile[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchMembers();
  }, [isAdmin]);

  const toggleFeatured = async (member: MemberProfile) => {
    const { error } = await supabase
      .from("members")
      .update({ featured: !member.featured })
      .eq("id", member.id);
    if (error) toast.error(error.message);
    else {
      toast.success(member.featured ? "Removed from featured" : "Marked as featured");
      fetchMembers();
    }
  };

  const deleteMember = async (member: MemberProfile) => {
    if (!confirm(`Delete ${member.name}?`)) return;
    const { error } = await supabase.from("members").delete().eq("id", member.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Member deleted");
      fetchMembers();
    }
  };

  const exportData = () => {
    const csv = [
      ["Name", "Username", "Country", "Work", "Featured", "Online", "Joined"].join(","),
      ...members.map((m) =>
        [m.name, m.username, m.country, m.work, m.featured, m.online, m.created_at].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pvaas-members.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported");
  };

  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const onlineCount = members.filter((m) => m.online).length;
  const featuredCount = members.filter((m) => m.featured).length;

  return (
    <div className="noise-bg pt-32 min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-accent" />
            <h1 className="text-display text-3xl md:text-4xl text-foreground">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage your PVAAS community</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Total Members", value: members.length, color: "text-primary" },
            { icon: UserCheck, label: "Online Now", value: onlineCount, color: "text-green-500" },
            { icon: Star, label: "Featured", value: featuredCount, color: "text-accent" },
            { icon: Globe, label: "Countries", value: new Set(members.map(m => m.country).filter(Boolean)).size, color: "text-secondary" },
          ].map((stat) => (
            <GlassCard key={stat.label} className="p-5" hover={false}>
              <stat.icon size={20} className={stat.color} />
              <div className="text-2xl font-bold text-foreground mt-2">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-foreground hover:bg-muted/50 transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>

        {/* Members Table */}
        <GlassCard className="p-0 overflow-hidden" hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Name</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Username</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider hidden sm:table-cell">Country</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider hidden md:table-cell">Work</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {m.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-foreground font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">@{m.username}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{m.country || "—"}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{m.work}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {m.online && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                        {m.featured && <Star size={14} className="text-accent fill-accent" />}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleFeatured(m)}
                          className={`p-2 rounded-lg transition-colors ${m.featured ? "text-accent hover:bg-accent/10" : "text-muted-foreground hover:bg-muted/50"}`}
                          title={m.featured ? "Remove featured" : "Mark featured"}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => deleteMember(m)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <div className="text-center py-10 text-muted-foreground">Loading...</div>}
          {!loading && members.length === 0 && <div className="text-center py-10 text-muted-foreground">No members yet</div>}
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminPanel;
