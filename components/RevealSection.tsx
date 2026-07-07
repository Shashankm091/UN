"use client";

import { motion } from "framer-motion";
import { ReactNode, forwardRef } from "react";

interface RevealSectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

const RevealSection = forwardRef<HTMLElement, RevealSectionProps>(
  ({ children, id, className = "", delay = 0 }, ref) => {
    return (
      <motion.section
        ref={ref}
        id={id}
        className={`relative ${className}`}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.section>
    );
  }
);

RevealSection.displayName = "RevealSection";
export default RevealSection;
