import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className = "", hover = true }: GlassCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      className={`glass glass-hover rounded-xl relative overflow-hidden group ${className}`}
      style={{
        background: hover
          ? "radial-gradient(circle 200px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124, 58, 237, 0.06), transparent), var(--glass-bg)"
          : undefined,
      }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
