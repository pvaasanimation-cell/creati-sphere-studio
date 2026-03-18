import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    filter: "blur(4px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const PageTransition = forwardRef<HTMLDivElement, { children: ReactNode }>(({ children }, ref) => (
  <motion.div
    ref={ref}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
));

PageTransition.displayName = "PageTransition";

export default PageTransition;
