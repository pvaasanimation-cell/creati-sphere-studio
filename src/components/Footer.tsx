import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="relative border-t border-border overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[120px] animate-breathe" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] rounded-full bg-secondary/4 blur-[100px] animate-float-slow" />
    </div>

    <div className="container mx-auto px-6 py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-xl gradient-bg-purple-cyan flex items-center justify-center font-bold text-primary-foreground text-lg glow-purple">
              P
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">PVAAS Animation</span>
          </motion.div>
          <p className="text-muted-foreground leading-relaxed max-w-md mb-6">
            A global collective of motion designers, 3D artists, and code-poets. We don't just build frames; we build worlds.
          </p>
          <div className="flex gap-3">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border-glow"
              >
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-interface text-foreground mb-4">Studio</h4>
          <div className="flex flex-col gap-3">
            {[["Works", "/works"], ["About", "/about"], ["Community", "/community"]].map(([label, path]) => (
              <Link key={path} to={path} className="text-muted-foreground hover:text-foreground transition-colors text-sm reveal-line inline-block pb-0.5 w-fit">
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-interface text-foreground mb-4">Connect</h4>
          <div className="flex flex-col gap-3">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors text-sm reveal-line inline-block pb-0.5 w-fit">
              Join Studio
            </Link>
            <span className="text-muted-foreground text-sm">hello@pvaas.studio</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>© 2026 PVAAS Animation Studio. All rights reserved.</span>
        <span className="text-xs text-muted-foreground/50">Crafted with ✨ by PVAAS</span>
      </div>
    </div>
  </footer>
);

export default Footer;
