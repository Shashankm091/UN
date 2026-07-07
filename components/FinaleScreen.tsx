"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import AmbientBackground from "./AmbientBackground";
import { siteConfig } from "@/lib/config";
import { massiveConfetti, fireworks } from "@/animations/celebration";

export default function FinaleScreen() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [lineIndex, setLineIndex] = useState(0);
  const lines = siteConfig.finale.lines;

  useEffect(() => {
    if (!inView) return;
    massiveConfetti();
    fireworks();
    const timer = setInterval(() => {
      setLineIndex((i) => Math.min(i + 1, lines.length - 1));
    }, 1800);
    return () => clearInterval(timer);
  }, [inView, lines.length]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A0618] to-[#1B1035] px-6 text-center"
    >
      <AmbientBackground density="high" />

      {/* moon */}
      <div className="absolute right-10 top-16 h-20 w-20 rounded-full bg-gold/90 shadow-[0_0_60px_20px_rgba(255,232,184,0.4)] md:right-24 md:top-20" />

      {/* fireflies */}
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={`firefly-${i}`}
          className="absolute h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(255,232,184,0.8)]"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -15, 0] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl text-white drop-shadow-[0_0_25px_rgba(255,214,232,0.5)] md:text-5xl"
          >
            {lines[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
