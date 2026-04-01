import { useRef, useState, useEffect, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Play, Zap, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TextReveal from "@/components/TextReveal";
import GlassCard from "@/components/GlassCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import { supabase } from "@/integrations/supabase/client";
import type { MemberProfile } from "@/contexts/AuthContext";

// Lazy-load heavy 3D components
const ParticleField = lazy(() => import("@/components/ParticleField"));
const Character3D = lazy(() => import("@/components/Character3D"));
const ScrollStorySection = lazy(() => import("@/components/ScrollStorySection"));
const InteractivePlayground = lazy(() => import("@/components/InteractivePlayground"));

gsap.registerPlugin(ScrollTrigger);

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const services = [
  { icon: Sparkles, title: "3D Animation", desc: "Hollywood-grade character animation and world-building." },
  { icon: Play, title: "Motion Design", desc: "Kinetic typography, UI animations, and brand motion." },
  { icon: Zap, title: "Visual Effects", desc: "Compositing, particle systems, and cinematic VFX." },
  { icon: Globe, title: "Interactive", desc: "WebGL experiences, AR filters, and immersive web." },
];

/* ─── Cinematic divider ─── */
const CinematicDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div style={{ opacity }} className="flex items-center gap-4">
          <motion.div style={{ scaleX, transformOrigin: "left" }} className="flex-1 h-px gradient-bg-purple-cyan" />
          <motion.div style={{ opacity }} className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <motion.div style={{ scaleX, transformOrigin: "right" }} className="flex-1 h-px gradient-bg-purple-cyan" />
        </motion.div>
      </div>
    </div>
  );
};

/* ─── Service card ─── */
const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10;
      const rotateX = ((rect.top + rect.height / 2 - e.clientY) / rect.height) * 6;
      gsap.to(el, { rotateX, rotateY, duration: 0.3, ease: "power2.out", transformPerspective: 800 });
    };
    const handleLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => { el.removeEventListener("mousemove", handleMove); el.removeEventListener("mouseleave", handleLeave); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ...transition, delay: index * 0.1 }}
    >
      <div ref={ref} style={{ transformStyle: "preserve-3d" }}>
        <GlassCard className="p-6 h-full relative overflow-hidden group border-glow">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl bg-primary" />
          <div className="relative z-10" style={{ transform: "translateZ(15px)" }}>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-500">
              <service.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2 text-lg">{service.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

/* ─── Real Member card ─── */
const MemberCard = ({ member, index }: { member: MemberProfile; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, rotateY: -10 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ ...transition, delay: index * 0.12 }}
    style={{ transformPerspective: 800 }}
  >
    <GlassCard className="p-6 text-center relative overflow-hidden group border-glow">
      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-[72px] h-[72px] rounded-2xl mx-auto mb-4 overflow-hidden"
        >
          {(member as any).avatar_url ? (
            <img src={(member as any).avatar_url} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-bg-purple-cyan flex items-center justify-center text-primary-foreground font-bold text-2xl">
              {member.name[0]?.toUpperCase()}
            </div>
          )}
        </motion.div>
        <h3 className="font-bold text-foreground text-lg">{member.name}</h3>
        <p className="text-sm text-primary mt-1 font-medium">{member.work}</p>
        <p className="text-xs text-muted-foreground mt-1">{member.country}</p>
        {member.online && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        )}
      </div>
    </GlassCard>
  </motion.div>
);

/* ═══ Main Page ═══ */
const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.95]);
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroBlur = useTransform(heroScroll, [0, 0.8], [0, 10]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);

  const [featuredMembers, setFeaturedMembers] = useState<MemberProfile[]>([]);
  const [stats, setStats] = useState({ total: 0, countries: 0, online: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const { data: members } = await supabase.from("members").select("*");
      if (members) {
        const featured = members.filter((m: any) => m.featured);
        setFeaturedMembers((featured.length > 0 ? featured : members).slice(0, 4) as unknown as MemberProfile[]);
        setStats({
          total: members.length,
          countries: new Set(members.map((m: any) => m.country).filter(Boolean)).size,
          online: members.filter((m: any) => m.online).length,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-gsap-section]");
    sections.forEach((section) => {
      gsap.fromTo(section, { scale: 0.96, opacity: 0.5 }, {
        scale: 1, opacity: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "top 40%", scrub: 1.2 },
      });
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="noise-bg">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
        <motion.div className="absolute inset-0 z-[1]" style={{ y: heroBgY }}>
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        </motion.div>

        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-secondary/4 blur-[60px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale, filter: heroFilter }} className="relative z-10 container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.3 }}>
                <motion.span
                  initial={{ opacity: 0, letterSpacing: "0.5em" }}
                  animate={{ opacity: 1, letterSpacing: "0.15em" }}
                  transition={{ duration: 1.2, delay: 0.2 }}
                  className="text-interface text-primary mb-6 block"
                >
                  PVAAS Animation Studio
                </motion.span>
                <h1 className="text-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] mb-6 text-foreground leading-[1.02]">
                  <TextReveal variant="words" className="inline" delay={0.4}>Where Creativity</TextReveal>
                  <br />
                  <span className="gradient-purple-cyan inline-block">
                    <TextReveal variant="letters" className="inline" delay={0.8}>Becomes Motion</TextReveal>
                  </span>
                </h1>
                <TextReveal variant="blur" delay={1} as="p" className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                  A global collective of motion designers, 3D artists, and code-poets. We don't just build frames — we build worlds.
                </TextReveal>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: 0.7 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/works" className="group px-8 py-4 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold btn-cinematic hover:shadow-[0_0_60px_rgba(124,58,237,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2">
                  View Our Work
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/auth" className="px-8 py-4 rounded-xl glass text-foreground font-semibold btn-cinematic hover:-translate-y-1 hover:border-primary/30 flex items-center justify-center gap-2">
                  Join the Pulse
                </Link>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...transition, delay: 0.5 }} className="flex-1 w-full max-w-lg">
              <Suspense fallback={<div className="w-full h-[320px]" />}>
                <Character3D />
              </Suspense>
            </motion.div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-interface text-muted-foreground text-[10px]">Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border border-muted-foreground/30 flex justify-center pt-1.5">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      <section data-gsap-section className="py-24 border-y border-border/50 relative z-10">
        <div className="absolute inset-0 gradient-bg-subtle opacity-50" />
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
          <AnimatedCounter end={stats.total || 0} label="Members" suffix="+" />
          <AnimatedCounter end={stats.countries || 0} label="Countries" />
          <AnimatedCounter end={0} label="Projects" />
          <AnimatedCounter end={stats.online || 0} label="Online Now" />
        </div>
      </section>

      <CinematicDivider />

      {/* ═══ SCROLL STORY ═══ */}
      <ScrollStorySection />

      <CinematicDivider />

      {/* ═══ SERVICES ═══ */}
      <section data-gsap-section className="py-[12vh] relative z-10">
        <div className="container mx-auto px-6">
          <SectionHeading tag="Services" title="What We Create" description="From concept to final render, we bring visions to life." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.title} service={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <CinematicDivider />

      {/* ═══ INTERACTIVE PLAYGROUND ═══ */}
      <div data-gsap-section>
        <InteractivePlayground />
      </div>

      <CinematicDivider />

      {/* ═══ FEATURED MEMBERS (real data) ═══ */}
      {featuredMembers.length > 0 && (
        <section data-gsap-section className="py-[12vh] relative z-10">
          <div className="container mx-auto px-6">
            <SectionHeading tag="Community" title="Featured Creators" description="Meet the talented artists behind our work." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredMembers.map((m, i) => (
                <MemberCard key={m.id} member={m} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CinematicDivider />

      {/* ═══ CTA ═══ */}
      <section data-gsap-section className="py-[12vh] relative z-10">
        <div className="container mx-auto px-6">
          <GlassCard className="p-12 md:p-20 text-center relative overflow-hidden border-glow" hover={false}>
            <div className="absolute top-0 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] animate-breathe" />
            <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] rounded-full bg-secondary/5 blur-[80px] animate-float-slow" />
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={transition} className="relative z-10">
              <span className="text-interface text-primary mb-4 block">Join Us</span>
              <h2 className="text-display text-3xl md:text-5xl lg:text-6xl text-foreground mb-6">
                Ready to Build <span className="gradient-purple-cyan">Worlds?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                Join a collective of creators pushing the boundaries of animation and interactive experiences.
              </p>
              <Link to="/auth" className="group inline-flex items-center gap-2 px-10 py-5 rounded-xl gradient-bg-purple-cyan text-primary-foreground font-semibold text-lg btn-cinematic hover:shadow-[0_0_60px_rgba(124,58,237,0.4)] hover:-translate-y-1">
                Join the Pulse
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

export default Index;
