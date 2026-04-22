import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield, User, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Works", path: "/works" },
  { label: "About", path: "/about" },
  { label: "Members", path: "/members" },
  { label: "Community", path: "/community" },
];

interface MemberResult {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  work: string | null;
  online: boolean | null;
}

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<MemberResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut, memberProfile } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location]);

  // Debounced member search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    setSearchLoading(true);
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();
      const { data } = await supabase
        .from("members")
        .select("id, name, username, avatar_url, work, online")
        .or(`name.ilike.%${q}%,username.ilike.%${q}%`)
        .limit(8);
      setResults((data as MemberResult[]) || []);
      setSearchLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const openMemberProfile = (username: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`/member/${username}`);
  };


  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="/favicon.ico" alt="PVAAS" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">
            PVAAS
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-interface px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2" ref={searchRef}>
          {/* Member Search */}
          <div className="relative">
            <button
              onClick={() => {
                setSearchOpen((v) => !v);
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search members"
            >
              <Search size={14} />
              <span className="hidden lg:inline">Search members</span>
              <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground font-mono">⌘K</kbd>
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 glass rounded-xl overflow-hidden shadow-2xl border border-border/50 z-50"
                >
                  <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/50">
                    <Search size={14} className="text-muted-foreground shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or username…"
                      className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchLoading && (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground">Searching…</div>
                    )}
                    {!searchLoading && searchQuery && results.length === 0 && (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground">No members found</div>
                    )}
                    {!searchLoading && !searchQuery && (
                      <div className="px-4 py-6 text-center text-xs text-muted-foreground">Type to search members</div>
                    )}
                    {results.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => openMemberProfile(m.username)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        {m.avatar_url ? (
                          <img src={m.avatar_url} alt={m.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-lg gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                            {m.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm text-foreground truncate">{m.name}</p>
                            {m.online && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">@{m.username} · {m.work || "Member"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-accent hover:bg-accent/10 transition-colors text-sm font-medium"
            >
              <Shield size={14} /> Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors">
                {(memberProfile as any)?.avatar_url ? (
                  <img src={(memberProfile as any).avatar_url} alt="" className="w-7 h-7 rounded-lg object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-lg gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {memberProfile?.name?.[0]?.toUpperCase() || <User size={14} />}
                  </div>
                )}
                <span className="text-sm text-muted-foreground">
                  {memberProfile?.name || "Profile"}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg glass text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-5 py-2.5 rounded-lg gradient-bg-purple-cyan text-primary-foreground text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:-translate-y-0.5"
            >
              Join Studio
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 rounded-lg text-accent text-sm font-medium flex items-center gap-2">
                  <Shield size={14} /> Admin Panel
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" className="px-4 py-3 rounded-lg text-sm text-foreground hover:text-primary flex items-center gap-2">
                    <User size={14} /> My Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground text-left flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-3 rounded-lg text-primary text-sm font-medium">
                  Join / Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
