import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { Lightbulb, Pencil, Film, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: Lightbulb,
    phase: "01",
    title: "The Idea",
    subtitle: "It starts with a spark",
    description: "Every masterpiece begins as a fleeting thought — a vision that demands to be seen. We capture that raw creative energy and give it form.",
    color: "from-accent to-primary",
    glowColor: "var(--glow-gold)",
    emoji: "💡",
  },
  {
    icon: Pencil,
    phase: "02",
    title: "The Sketch",
    subtitle: "Lines become life",
    description: "Rough strokes evolve into refined drawings. Characters take shape, worlds emerge from blank canvases, and stories begin to breathe.",
    color: "from-primary to-secondary",
    glowColor: "var(--glow-purple)",
    emoji: "✏️",
  },
  {
    icon: Film,
    phase: "03",
    title: "The Animation",
    subtitle: "Motion tells the story",
    description: "Frame by frame, breath by breath — static art transforms into fluid motion. Every movement is choreographed to evoke emotion.",
    color: "from-secondary to-primary",
    glowColor: "var(--glow-cyan)",
    emoji: "🎬",
  },
  {
    icon: Sparkles,
    phase: "04",
    title: "The Final Scene",
    subtitle: "Magic meets the screen",
    description: "Lighting, sound, effects — everything converges into a cinematic experience. What was once an idea is now an unforgettable moment.",
    color: "from-primary to-accent",
    glowColor: "var(--glow-purple)",
    emoji: "🌟",
  },
];

const StoryStep = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 === 0 ? -80 : 80, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1]);
  const blur = useTransform(scrollYProgress, [0, 0.3, 1], [6, 0, 0]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  // GSAP 3D tilt on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 8;
      const rotateX = ((centerY - e.clientY) / rect.height) * 5;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };

    const handleLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale, filter: filterBlur }}
      className="relative"
    >
      {/* Large background emoji */}
      <div className="absolute -top-8 right-8 text-7xl md:text-9xl opacity-[0.04] pointer-events-none select-none">
        {step.emoji}
      </div>

      <div className="flex items-start gap-6 md:gap-12">
        {/* Timeline node */}
        <div className="hidden md:flex flex-col items-center gap-3 min-w-[80px] pt-8">
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg relative cursor-pointer`}
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <step.icon size={28} className="text-primary-foreground" />
            <div className="absolute inset-0 rounded-2xl animate-ping-slow opacity-20" style={{ background: step.glowColor }} />
          </motion.div>
          <span className="text-interface text-muted-foreground">{step.phase}</span>
        </div>

        {/* Content card with 3D tilt */}
        <div
          ref={cardRef}
          className="flex-1 glass-strong rounded-2xl p-8 md:p-10 relative overflow-hidden group border-glow"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Gradient sweep on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-700`} />
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

          {/* Mobile icon */}
          <div className="md:hidden flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
              <step.icon size={20} className="text-primary-foreground" />
            </div>
            <span className="text-interface text-muted-foreground">{step.phase}</span>
          </div>

          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <span className="text-interface text-primary mb-2 block">{step.subtitle}</span>
            <h3 className="text-display text-2xl md:text-4xl text-foreground mb-4">
              {step.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed max-w-lg">
              {step.description}
            </p>
          </div>

          {/* Corner glow */}
          <div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-15 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
            style={{ background: step.glowColor }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const ScrollStorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // GSAP section zoom-in
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.95 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-[15vh] relative z-10 will-change-transform">
      <div className="absolute inset-0 gradient-bg-cinematic pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-interface text-primary mb-4 block">The Process</span>
          <h2 className="text-display text-3xl md:text-5xl text-foreground mb-4">
            From Spark to <span className="gradient-purple-cyan">Screen</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every animation follows a journey. Scroll to witness ours.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-[40px] top-0 bottom-0 w-px bg-border">
            <motion.div style={{ height: lineHeight }} className="w-full gradient-bg-purple-cyan" />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, i) => (
              <StoryStep key={step.phase} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStorySection;
