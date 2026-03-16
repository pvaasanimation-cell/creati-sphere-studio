import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, Zap, Globe } from "lucide-react";
import ParticleField from "@/components/ParticleField";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionHeading from "@/components/SectionHeading";
import ScrollStorySection from "@/components/ScrollStorySection";
import heroBg from "@/assets/hero-bg.jpg";
import cosmicDreams from "@/assets/work-cosmic-dreams.jpg";
import neonCity from "@/assets/work-neon-city.jpg";
import abstractFlow from "@/assets/work-abstract-flow.jpg";
import digitalWorlds from "@/assets/work-digital-worlds.jpg";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const works = [
  { title: "Cosmic Dreams", category: "3D Animation", image: cosmicDreams },
  { title: "Neon City", category: "Motion Graphics", image: neonCity },
  { title: "Abstract Flow", category: "VFX", image: abstractFlow },
  { title: "Digital Worlds", category: "2D Animation", image: digitalWorlds },
];

const services = [
  { icon: Sparkles, title: "3D Animation", desc: "Hollywood-grade character animation and world-building." },
  { icon: Play, title: "Motion Design", desc: "Kinetic typography, UI animations, and brand motion." },
  { icon: Zap, title: "Visual Effects", desc: "Compositing, particle systems, and cinematic VFX." },
  { icon: Globe, title: "Interactive", desc: "WebGL experiences, AR filters, and immersive web." },
];

const featuredMembers = [
  { name: "Rahul", role: "Lead Animator", country: "India" },
  { name: "Ahmed", role: "3D Artist", country: "UAE" },
  { name: "Sarah", role: "Motion Designer", country: "UK" },
  { name: "Yuki", role: "VFX Artist", country: "Japan" },
];

const Index = () => {
  return (
    <div className="noise-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 z-[1]">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.3 }}
          >
            <span className="text-interface text-primary mb-6 block">Animation Studio</span>
            <h1 className="text-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 text-foreground">
              Where Creativity
              <br />
              <span className="gradient-purple-cyan">Becomes Motion</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              A global collective of motion designers, 3D artists, and code-poets.
              We don't just build frames — we build worlds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/works"
              className="px-8 py-4 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              View Our Work <ArrowRight size={18} />
            </Link>
            <Link
              to="/join"
              className="px-8 py-4 rounded-xl glass text-foreground font-semibold transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Join the Pulse
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-interface text-muted-foreground text-[10px]">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-border relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter end={156} label="Members" suffix="+" />
          <AnimatedCounter end={12} label="Countries" />
          <AnimatedCounter end={48} label="Projects" />
          <AnimatedCounter end={9} label="Online Now" />
        </div>
      </section>

      {/* Featured Works */}
      <section className="py-[15vh] relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading
            tag="Portfolio"
            title="Featured Works"
            description="A curated selection of our most ambitious projects."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {works.map((work, i) => (
              <motion.div
                key={work.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: i * 0.1 }}
              >
                <GlassCard className="p-0 overflow-hidden cursor-pointer group">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={work.image} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <span className="text-interface text-primary">{work.category}</span>
                    <h3 className="text-xl font-bold text-foreground mt-1">{work.title}</h3>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/works"
              className="text-interface text-primary hover:text-foreground transition-colors inline-flex items-center gap-2"
            >
              View All Works <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll Story */}
      <ScrollStorySection />

      {/* Services */}
      <section className="py-[15vh] relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading
            tag="Services"
            title="What We Create"
            description="From concept to final render, we bring visions to life."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: i * 0.1 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Members */}
      <section className="py-[15vh] relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading
            tag="Community"
            title="Featured Creators"
            description="Meet the talented artists behind our work."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredMembers.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...transition, delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full gradient-bg-purple-cyan mx-auto mb-4 flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {m.name[0]}
                  </div>
                  <h3 className="font-bold text-foreground">{m.name}</h3>
                  <p className="text-sm text-primary mt-1">{m.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.country}</p>
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[15vh] relative z-10">
        <div className="container mx-auto px-6">
          <GlassCard className="p-12 md:p-20 text-center" hover={false}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={transition}
            >
              <span className="text-interface text-primary mb-4 block">Join Us</span>
              <h2 className="text-display text-3xl md:text-5xl text-foreground mb-4">
                Ready to Build <span className="gradient-purple-cyan">Worlds?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                Join a collective of creators pushing the boundaries of animation and interactive experiences.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:-translate-y-1"
              >
                Join the Pulse <ArrowRight size={18} />
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Index;
