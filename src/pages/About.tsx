import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GlassCard from "@/components/GlassCard";
import { Target, Eye, Heart, Lightbulb } from "lucide-react";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const timeline = [
  { year: "2020", title: "The Spark", desc: "PVAAS Animation was born from a shared vision of redefining digital storytelling." },
  { year: "2021", title: "First Reel", desc: "Our debut showreel gained recognition at international animation festivals." },
  { year: "2022", title: "Community", desc: "Opened doors to global talent — animators, designers, and developers joined the collective." },
  { year: "2023", title: "Studio Growth", desc: "Expanded into 3D, VFX, and interactive experiences for major brands." },
  { year: "2024", title: "Global Reach", desc: "Members across 12+ countries collaborating in real-time on ambitious projects." },
  { year: "2025", title: "The Future", desc: "Pioneering AI-assisted animation and immersive WebGL experiences." },
];

const values = [
  { icon: Target, title: "Precision", desc: "Every frame, every pixel, every interaction is intentional." },
  { icon: Eye, title: "Vision", desc: "We see beyond the brief to create something truly extraordinary." },
  { icon: Heart, title: "Passion", desc: "Creativity isn't work — it's the force that drives everything we do." },
  { icon: Lightbulb, title: "Innovation", desc: "We embrace new tools, techniques, and technologies to push boundaries." },
];

const team = [
  { name: "Alex Rivera", role: "Creative Director", initial: "A" },
  { name: "Priya Sharma", role: "Lead 3D Artist", initial: "P" },
  { name: "Marcus Chen", role: "Motion Lead", initial: "M" },
  { name: "Luna Kim", role: "VFX Supervisor", initial: "L" },
];

const About = () => (
  <div className="noise-bg pt-32">
    {/* Hero */}
    <section className="py-[10vh]">
      <div className="container mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
          <span className="text-interface text-primary mb-4 block">About Us</span>
          <h1 className="text-display text-4xl md:text-6xl lg:text-7xl text-foreground mb-6">
            The Studio Behind
            <br />
            <span className="gradient-purple-cyan">The Motion</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            We are a global creative collective building at the intersection of art, technology, and storytelling.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Values */}
    <section className="py-[10vh]">
      <div className="container mx-auto px-6">
        <SectionHeading tag="Philosophy" title="What Drives Us" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.1 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-[10vh]">
      <div className="container mx-auto px-6">
        <SectionHeading tag="Journey" title="Our Story" />
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } flex-row`}
            >
              <div className="hidden md:block flex-1" />
              <div className="relative z-10 w-8 h-8 rounded-full gradient-bg-purple-cyan flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-xs font-bold">{item.year.slice(-2)}</span>
              </div>
              <div className="flex-1">
                <GlassCard className="p-5">
                  <span className="text-interface text-primary">{item.year}</span>
                  <h3 className="font-bold text-foreground mt-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-[10vh] pb-[15vh]">
      <div className="container mx-auto px-6">
        <SectionHeading tag="Team" title="Core Team" description="The minds orchestrating the creative vision." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: i * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                <div className="w-20 h-20 rounded-full gradient-bg-purple-cyan mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {m.initial}
                </div>
                <h3 className="font-bold text-foreground">{m.name}</h3>
                <p className="text-sm text-primary mt-1">{m.role}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default About;
