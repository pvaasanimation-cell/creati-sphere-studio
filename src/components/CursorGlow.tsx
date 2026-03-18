import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleClick = useCallback((e: MouseEvent) => {
    if (!rippleRef.current) return;
    const ripple = rippleRef.current;
    ripple.style.left = `${e.clientX - 25}px`;
    ripple.style.top = `${e.clientY - 25}px`;
    ripple.style.opacity = "1";
    ripple.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      ripple.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease-out";
      ripple.style.transform = "scale(3)";
      ripple.style.opacity = "0";
    });
  }, []);

  useEffect(() => {
    if (isMobile) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let trailX = 0, trailY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Magnetic hover on buttons/links
    const magneticElements = new Set<HTMLElement>();
    const setupMagnetic = () => {
      document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
        const htmlEl = el as HTMLElement;
        if (magneticElements.has(htmlEl)) return;
        magneticElements.add(htmlEl);

        htmlEl.addEventListener("mousemove", (e: Event) => {
          const me = e as MouseEvent;
          const rect = htmlEl.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (me.clientX - cx) * 0.15;
          const dy = (me.clientY - cy) * 0.15;
          htmlEl.style.transform = `translate(${dx}px, ${dy}px)`;
          htmlEl.style.transition = "transform 0.2s ease-out";
        });

        htmlEl.addEventListener("mouseleave", () => {
          htmlEl.style.transform = "";
          htmlEl.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
        });
      });
    };

    // Initial setup + observe DOM changes
    setupMagnetic();
    const observer = new MutationObserver(setupMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    const animate = () => {
      glowX += (mouseX - glowX) * 0.18;
      glowY += (mouseY - glowY) * 0.18;
      trailX += (mouseX - trailX) * 0.05;
      trailY += (mouseY - trailY) * 0.05;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowX - 20}px, ${glowY - 20}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailX - 120}px, ${trailY - 120}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [isMobile, handleClick]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none layer-cursor mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.7) 0%, rgba(6, 182, 212, 0.3) 40%, transparent 70%)",
          willChange: "transform",
        }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 w-[240px] h-[240px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, rgba(6, 182, 212, 0.02) 40%, transparent 70%)",
          willChange: "transform",
          filter: "blur(40px)",
          zIndex: 9998,
        }}
      />
      <div
        ref={rippleRef}
        className="fixed w-[50px] h-[50px] rounded-full pointer-events-none"
        style={{
          border: "1px solid rgba(124, 58, 237, 0.4)",
          opacity: 0,
          zIndex: 9999,
          willChange: "transform, opacity",
        }}
      />
    </>
  );
};

export default CursorGlow;
