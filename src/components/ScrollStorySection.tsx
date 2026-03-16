import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Pencil, Film, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    phase: "01",
    title: "The Idea",
    subtitle: "It starts with a spark",
    description: "Every masterpiece begins as a fleeting thought — a vision that demands to be seen. We capture that raw creative energy and give it form.",
    color: "from-accent to-primary",
    glowColor: "var(--glow-gold)",
  },
  {
    icon: Pencil,
    phase: "02",
    title: "The Sketch",
    subtitle: "Lines become life",
    description: "Rough strokes evolve into refined drawings. Characters take shape, worlds emerge from blank canvases, and stories begin to breathe.",
    color: "from-primary to-secondary",
    glowColor: "var(--glow-purple)",
  },
  {
    icon: Film,
    phase: "03",
    title: "The Animation",
    subtitle: "Motion tells the story",
    description: "Frame by frame, breath by breath — static art transforms into fluid motion. Every movement is choreographed to evoke emotion.",
    color: "from-secondary to-primary",
    glowColor: "var(--glow-cyan)",
  },
  {
    icon: Sparkles,
    phase: "04",
    title: "The Final Scene",
    subtitle: "Magic meets the screen",
    description: "Lighting, sound, effects — everything converges into a cinematic experience. What was once an idea is now an unforgettable moment.",
    color: "from-primary to-accent",
    glowColor: "var(--glow-purple)",
  },
];

const StoryStep = ({ step, index }: { step: typeof steps[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? -120 : 120, 0, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
  const iconRotate = useTransform(scrollYProgress, [0, 1], [-30, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, x, scale }}
      className="relative flex items-center gap-8 md:gap-16"
    >
      {/* Timeline connector */}
      <div className="hidden md:flex flex-col items-center gap-2 min-w-[80px]">
        <motion.div
          style={{ rotate: iconRotate }}
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <step.icon size={28} className="text-primary-foreground" />
        </motion.div>
        <span className="text-interface text-muted-foreground">{step.phase}</span>
      </div>

      {/* Content card */}
      <div className="flex-1 glass rounded-2xl p-8 md:p-10 relative overflow-hidden group">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700`}
        />

        {/* Mobile icon */}
        <div className="md:hidden flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
            <step.icon size={20} className="text-primary-foreground" />
          </div>
          <span className="text-interface text-muted-foreground">{step.phase}</span>
        </div>

        <div className="relative z-10">
          <span className="text-interface text-primary mb-2 block">{step.subtitle}</span>
          <h3 className="text-display text-2xl md:text-4xl text-foreground mb-4">
            {step.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed max-w-lg">
            {step.description}
          </p>
        </div>

        {/* Decorative glow */}
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
          style={{ background: step.glowColor }}
        />
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

  return (
    <section ref={containerRef} className="py-[15vh] relative z-10">
      <div className="container mx-auto px-6">
        {/* Section header */}
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

        {/* Timeline line (desktop) */}
        <div className="relative">
          <div className="hidden md:block absolute left-[40px] top-0 bottom-0 w-px bg-border">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full gradient-bg-purple-cyan"
            />
          </div>

          {/* Steps */}
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
