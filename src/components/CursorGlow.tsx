import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let trailX = 0, trailY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Main glow follows fast
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      // Trail follows slower
      trailX += (mouseX - trailX) * 0.06;
      trailY += (mouseY - trailY) * 0.06;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailX - 100}px, ${trailY - 100}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Small precise dot */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.6) 0%, rgba(6, 182, 212, 0.3) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
      {/* Large ambient trail */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[200px] h-[200px] rounded-full pointer-events-none z-[9998]"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.04) 0%, rgba(6, 182, 212, 0.02) 40%, transparent 70%)",
          willChange: "transform",
          filter: "blur(30px)",
        }}
      />
    </>
  );
};

export default CursorGlow;
