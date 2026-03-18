import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const CinematicLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated arc on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let angle = 0;
    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;
      const radius = 70;

      // Subtle concentric rings
      for (let i = 3; i >= 1; i--) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius - i * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 58, 237, ${0.03 * i})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Main arc – cyan glow
      const arcLen = Math.PI * 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, angle, angle + arcLen);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.6)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(6, 182, 212, 0.8)";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary arc – pink/purple
      ctx.beginPath();
      ctx.arc(cx, cy, radius, angle + Math.PI * 0.3, angle + Math.PI * 0.3 + arcLen * 0.4);
      ctx.strokeStyle = "rgba(236, 72, 153, 0.5)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "rgba(236, 72, 153, 0.6)";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;

      angle += 0.03;
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setPhase("reveal");
          setTimeout(() => {
            setPhase("done");
            setTimeout(onComplete, 600);
          }, 800);
          return 100;
        }
        return p + Math.random() * 12 + 4;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
        >
          {/* Background ambient */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] animate-breathe" />
            <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] animate-float-slow" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center gap-6 relative"
          >
            {/* Rotating arc canvas */}
            <div className="relative w-[200px] h-[200px]">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ width: 200, height: 200 }}
              />
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 0.3 }}
                  className="text-foreground/70 text-lg font-light tracking-wider"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  loading
                </motion.span>
              </div>
            </div>

            {/* Logo reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={phase === "reveal" ? { opacity: 1, y: 0, scale: 1.1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-bg-purple-cyan flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-foreground font-bold text-lg tracking-tight"
                >
                  PVAAS
                </motion.span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="tabular-nums">{Math.min(Math.round(progress), 100)}%</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicLoader;
