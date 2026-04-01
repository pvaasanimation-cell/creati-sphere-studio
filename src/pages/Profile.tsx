import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Globe, Briefcase, FileText, MapPin, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

const workTypes = ["Animator", "Designer", "Editor", "Developer", "VFX Artist", "3D Artist", "Member"];

const Profile = () => {
  const { user, memberProfile, loading: authLoading, isAdmin, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    country: "",
    city: "",
    bio: "",
    work: "",
  });

  useEffect(() => {
    if (memberProfile) {
      setForm({
        name: memberProfile.name || "",
        username: memberProfile.username || "",
        country: memberProfile.country || "",
        city: memberProfile.city || "",
        bio: memberProfile.bio || "",
        work: memberProfile.work || "",
      });
      setAvatarUrl(memberProfile.avatar_url || "");
    }
  }, [memberProfile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = urlData.publicUrl + "?t=" + Date.now();

    const { error: updateError } = await supabase
      .from("members")
      .update({ avatar_url: newUrl })
      .eq("user_id", user.id);

    if (updateError) toast.error(updateError.message);
    else {
      setAvatarUrl(newUrl);
      toast.success("Avatar updated!");
      refreshProfile();
    }
    setUploading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.name.trim() || !form.username.trim()) {
      toast.error("Name and username are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("members")
      .update({
        name: form.name.trim(),
        username: form.username.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        bio: form.bio.trim(),
        work: form.work.trim(),
      })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated!");
      refreshProfile();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="noise-bg pt-28 pb-16 min-h-screen">
      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="text-center mb-8">
          <span className="text-interface text-primary mb-3 block">Profile</span>
          <h1 className="text-display text-3xl md:text-4xl text-foreground">
            Your <span className="gradient-purple-cyan">Profile</span>
          </h1>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.1 }}>
          <GlassCard className="p-6 md:p-8" hover={false}>
            {/* Avatar + Quick Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b border-border/50">
              <div
                className="relative w-28 h-28 rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
                onClick={() => fileRef.current?.click()}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground font-bold text-4xl">
                    {form.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={28} className="text-foreground" />
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />

              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold text-foreground">{form.name || "Your Name"}</h2>
                <p className="text-sm text-primary font-medium">@{form.username || "username"}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {form.work && (
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      {form.work}
                    </span>
                  )}
                  {isAdmin && (
                    <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium flex items-center gap-1">
                      <Shield size={10} /> Admin
                    </span>
                  )}
                  {form.country && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} /> {form.country}{form.city ? `, ${form.city}` : ""}
                    </span>
                  )}
                </div>
                {form.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{form.bio}</p>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-interface text-muted-foreground mb-1.5 flex items-center gap-1 text-xs"><User size={11} /> Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-interface text-muted-foreground mb-1.5 block text-xs">Username *</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, "").toLowerCase() })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    required
                    maxLength={30}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-interface text-muted-foreground mb-1.5 flex items-center gap-1 text-xs"><Globe size={11} /> Country</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    maxLength={60}
                  />
                </div>
                <div>
                  <label className="text-interface text-muted-foreground mb-1.5 flex items-center gap-1 text-xs"><MapPin size={11} /> City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    maxLength={60}
                  />
                </div>
              </div>

              <div>
                <label className="text-interface text-muted-foreground mb-1.5 flex items-center gap-1 text-xs"><FileText size={11} /> Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  maxLength={300}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{form.bio.length}/300</p>
              </div>

              <div>
                <label className="text-interface text-muted-foreground mb-1.5 flex items-center gap-1 text-xs"><Briefcase size={11} /> Work Type</label>
                <div className="flex flex-wrap gap-2">
                  {workTypes.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setForm({ ...form, work: w })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        form.work === w
                          ? "gradient-bg-purple-cyan text-primary-foreground"
                          : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full mt-4 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-destructive/50 font-medium transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </GlassCard>
        </motion.div>

        {/* Member Since */}
        {memberProfile?.created_at && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-muted-foreground mt-6"
          >
            Member since {new Date(memberProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default Profile;
