import { motion, useInView, type Variant } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** "letters" = letter-by-letter, "words" = word-by-word, "blur" = blur→sharp slide-up */
  variant?: "letters" | "words" | "blur";
  delay?: number;
  once?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.03, delayChildren: delay },
  }),
};

const letterVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const wordVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const blurVariants: Record<string, Variant> = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const TextReveal = ({
  children,
  as: Tag = "span",
  className = "",
  variant = "blur",
  delay = 0,
  once = true,
}: TextRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  if (variant === "blur") {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={blurVariants}
        custom={delay}
      >
        <Tag className={className}>{children}</Tag>
      </motion.div>
    );
  }

  const items = variant === "letters" ? children.split("") : children.split(" ");
  const itemVariants = variant === "letters" ? letterVariants : wordVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      custom={delay}
      aria-label={children}
      className="inline"
    >
      <Tag className={className}>
        {items.map((item, i) => (
          <motion.span
            key={i}
            variants={itemVariants}
            className="inline-block"
            style={{ whiteSpace: variant === "words" ? "pre" : undefined }}
          >
            {variant === "words" ? (i < items.length - 1 ? item + "\u00A0" : item) : item === " " ? "\u00A0" : item}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
};

export default TextReveal;
