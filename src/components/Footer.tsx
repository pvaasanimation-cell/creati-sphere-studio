import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border py-16 relative">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg gradient-bg-purple-cyan flex items-center justify-center font-bold text-primary-foreground text-sm">P</div>
            <span className="font-bold text-lg text-foreground">PVAAS Animation</span>
          </div>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            A global collective of motion designers, 3D artists, and code-poets. We don't just build frames; we build worlds.
          </p>
        </div>
        <div>
          <h4 className="text-interface text-foreground mb-4">Studio</h4>
          <div className="flex flex-col gap-2">
            <Link to="/works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Works</Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About</Link>
            <Link to="/community" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Community</Link>
          </div>
        </div>
        <div>
          <h4 className="text-interface text-foreground mb-4">Connect</h4>
          <div className="flex flex-col gap-2">
            <Link to="/join" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Join Studio</Link>
            <span className="text-muted-foreground text-sm">hello@pvaas.studio</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
        © 2026 PVAAS Animation Studio. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
