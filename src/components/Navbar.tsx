import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Works", path: "/works" },
  { label: "About", path: "/about" },
  { label: "Members", path: "/members" },
  { label: "Community", path: "/community" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut, memberProfile } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

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

        <div className="hidden md:flex items-center gap-2">
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
