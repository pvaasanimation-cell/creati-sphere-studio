import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import GlassCard from "@/components/GlassCard";
import { X } from "lucide-react";

import cosmicDreams from "@/assets/work-cosmic-dreams.jpg";
import neonCity from "@/assets/work-neon-city.jpg";
import abstractFlow from "@/assets/work-abstract-flow.jpg";
import digitalWorlds from "@/assets/work-digital-worlds.jpg";
import chromaticPulse from "@/assets/work-chromatic-pulse.jpg";
import waveTheory from "@/assets/work-wave-theory.jpg";
import pixelStorm from "@/assets/work-pixel-storm.jpg";
import sakuraTales from "@/assets/work-sakura-tales.jpg";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const categories = ["All", "2D Animation", "3D Animation", "Motion Graphics", "VFX"];

const projects = [
  { title: "Cosmic Dreams", category: "3D Animation", desc: "An interstellar journey through procedurally generated galaxies.", image: cosmicDreams },
  { title: "Neon City", category: "Motion Graphics", desc: "Futuristic cityscapes brought to life with kinetic typography.", image: neonCity },
  { title: "Abstract Flow", category: "VFX", desc: "Fluid simulations and particle dynamics in a surreal dreamscape.", image: abstractFlow },
  { title: "Digital Worlds", category: "2D Animation", desc: "Hand-drawn character animation meets digital compositing.", image: digitalWorlds },
  { title: "Chromatic Pulse", category: "3D Animation", desc: "Real-time rendered 3D environments with ray-traced lighting.", image: chromaticPulse },
  { title: "Wave Theory", category: "Motion Graphics", desc: "Audio-reactive visuals synced to an original soundtrack.", image: waveTheory },
  { title: "Pixel Storm", category: "VFX", desc: "Destruction simulations with volumetric smoke and debris.", image: pixelStorm },
  { title: "Sakura Tales", category: "2D Animation", desc: "A poetic short film blending watercolor textures with animation.", image: sakuraTales },
];

const Works = () => {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<typeof projects[0] | null>(null);
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="noise-bg pt-32">
      <section className="py-[10vh]">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={transition} className="text-center mb-12">
            <span className="text-interface text-primary mb-4 block">Portfolio</span>
            <h1 className="text-display text-4xl md:text-6xl text-foreground mb-6">
              Our <span className="gradient-purple-cyan">Works</span>
            </h1>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  active === cat
                    ? "gradient-bg-purple-cyan text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelected(project)}
                  className="cursor-pointer"
                >
                  <GlassCard className="p-0 overflow-hidden group">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    </div>
                    <div className="p-6">
                      <span className="text-interface text-primary">{project.category}</span>
                      <h3 className="text-xl font-bold text-foreground mt-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{project.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={transition}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="aspect-video overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-interface text-primary">{selected.category}</span>
                    <h2 className="text-2xl font-bold text-foreground mt-1">{selected.title}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-1">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-muted-foreground mt-4 leading-relaxed">{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Works;
