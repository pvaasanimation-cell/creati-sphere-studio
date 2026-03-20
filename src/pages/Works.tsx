import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Film } from "lucide-react";

const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

const Works = () => {
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition, delay: 0.2 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Film size={64} className="text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
              Our portfolio is being curated. Check back soon for our latest animation projects and creative works.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Works;
