import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ tag, title, description }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-16"
  >
    <span className="text-interface text-primary mb-4 block">{tag}</span>
    <h2 className="text-display text-3xl md:text-5xl text-foreground mb-4">{title}</h2>
    {description && (
      <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
