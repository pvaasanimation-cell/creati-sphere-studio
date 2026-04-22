import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe,
  Users,
  Calendar,
  ArrowLeft,
  Star,
  Twitter,
  Instagram,
  Link as LinkIcon,
  UserPlus,
  UserCheck,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";
import type { MemberProfile as MemberProfileType } from "@/contexts/AuthContext";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

const MemberProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState<MemberProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  // Fetch member
  useEffect(() => {
    let cancelled = false;
    const fetchMember = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("members")
        .select("*")
        .eq("username", username ?? "")
        .maybeSingle();
      if (!cancelled) {
        setMember(data as MemberProfileType | null);
        setLoading(false);
      }
    };
    fetchMember();
    return () => {
      cancelled = true;
    };
  }, [username]);

  // Realtime: keep this member's online status fresh
  useEffect(() => {
    if (!member?.id) return;
    const channel = supabase
      .channel(`member-profile-${member.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "members", filter: `id=eq.${member.id}` },
        (payload) => {
          setMember((prev) => (prev ? { ...prev, ...(payload.new as Partial<MemberProfileType>) } : prev));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [member?.id]);

  // Fetch follow data
  useEffect(() => {
    if (!member?.user_id) return;
    const load = async () => {
      const [{ count }, followingCheck] = await Promise.all([
        supabase
          .from("member_follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", member.user_id),
        user
          ? supabase
              .from("member_follows")
              .select("id")
              .eq("follower_id", user.id)
              .eq("following_id", member.user_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);
      setFollowerCount(count ?? 0);
      setIsFollowing(!!(followingCheck as { data: unknown }).data);
    };
    load();
  }, [member?.user_id, user]);

  const handleFollowToggle = async () => {
    if (!user) {
      navigate("/auth?mode=login");
      return;
    }
    if (!member?.user_id || followLoading) return;
    setFollowLoading(true);
    if (isFollowing) {
      const { error } = await supabase
        .from("member_follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", member.user_id);
      if (error) {
        toast.error("Couldn't unfollow. Try again.");
      } else {
        setIsFollowing(false);
        setFollowerCount((c) => Math.max(0, c - 1));
      }
    } else {
      const { error } = await supabase
        .from("member_follows")
        .insert({ follower_id: user.id, following_id: member.user_id });
      if (error) {
        toast.error("Couldn't connect. Try again.");
      } else {
        setIsFollowing(true);
        setFollowerCount((c) => c + 1);
        toast.success(`Connected with ${member.name}`);
      }
    }
    setFollowLoading(false);
  };

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

  const isOwnProfile = user?.id === member.user_id;
  const projects = member.portfolio_url
    ? [{ title: "Portfolio", url: member.portfolio_url, description: "Featured work and case studies" }]
    : [];

  return (
    <div className="noise-bg pt-32 min-h-screen">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
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
              <div className="text-center mb-6">
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
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-sm text-accent">Online now</span>
                  </div>
                )}

                {member.featured && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
                      <Star size={14} /> Featured Creator
                    </span>
                  </div>
                )}

                {/* Connect / Follow button */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{followerCount}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Followers</p>
                  </div>
                  {!isOwnProfile && (
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-50 ${
                        isFollowing
                          ? "glass text-foreground hover:bg-muted/50"
                          : "gradient-bg-purple-cyan text-primary-foreground hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck size={16} /> Connected
                        </>
                      ) : (
                        <>
                          <UserPlus size={16} /> Connect
                        </>
                      )}
                    </button>
                  )}
                  {isOwnProfile && (
                    <Link
                      to="/profile"
                      className="px-6 py-2.5 rounded-xl glass text-sm text-foreground hover:bg-muted/50 transition-colors font-medium"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>
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
                        <p className="text-sm text-foreground">
                          {member.country}
                          {member.city ? `, ${member.city}` : ""}
                        </p>
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
                        {new Date(member.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(member.twitter || member.instagram || member.portfolio_url) && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {member.twitter && (
                      <a
                        href={
                          member.twitter.startsWith("http")
                            ? member.twitter
                            : `https://twitter.com/${member.twitter.replace(/^@/, "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 hover:bg-primary/10 transition-colors text-sm text-foreground"
                      >
                        <Twitter size={16} className="text-muted-foreground" />
                        {member.twitter.startsWith("http") ? "Twitter" : member.twitter}
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={
                          member.instagram.startsWith("http")
                            ? member.instagram
                            : `https://instagram.com/${member.instagram.replace(/^@/, "")}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 hover:bg-primary/10 transition-colors text-sm text-foreground"
                      >
                        <Instagram size={16} className="text-muted-foreground" />
                        {member.instagram.startsWith("http") ? "Instagram" : member.instagram}
                      </a>
                    )}
                    {member.portfolio_url && (
                      <a
                        href={
                          member.portfolio_url.startsWith("http")
                            ? member.portfolio_url
                            : `https://${member.portfolio_url}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 hover:bg-primary/10 transition-colors text-sm text-foreground"
                      >
                        <LinkIcon size={16} className="text-muted-foreground" />
                        Portfolio
                      </a>
                    )}
                  </div>
                )}

                {/* Projects */}
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Briefcase size={16} className="text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Projects</h2>
                  </div>
                  {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projects.map((p, i) => (
                        <a
                          key={i}
                          href={p.url.startsWith("http") ? p.url : `https://${p.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-5 rounded-xl bg-muted/30 hover:bg-primary/5 border border-transparent hover:border-primary/30 transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {p.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                            </div>
                            <ExternalLink
                              size={14}
                              className="text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors"
                            />
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="px-5 py-6 rounded-xl bg-muted/20 border border-dashed border-border/40 text-center">
                      <p className="text-sm text-muted-foreground">
                        {isOwnProfile
                          ? "Add a portfolio link to your profile to showcase your projects."
                          : "No projects shared yet."}
                      </p>
                    </div>
                  )}
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
