"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface AmbientBackgroundProps {
  density?: "low" | "medium" | "high";
  showHearts?: boolean;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AmbientBackground({
  density = "medium",
  showHearts = true,
}: AmbientBackgroundProps) {
  const starCount = density === "low" ? 30 : density === "high" ? 80 : 50;
  const heartCount = density === "low" ? 4 : density === "high" ? 10 : 6;

  const stars = useMemo(
    () =>
      Array.from({ length: starCount }, (_, i) => ({
        left: seededRandom(i * 3.1) * 100,
        top: seededRandom(i * 7.7) * 100,
        size: 1 + seededRandom(i * 1.3) * 2,
        delay: seededRandom(i * 5.5) * 4,
      })),
    [starCount]
  );

  const hearts = useMemo(
    () =>
      Array.from({ length: heartCount }, (_, i) => ({
        left: seededRandom(i * 9.2 + 1) * 100,
        top: 20 + seededRandom(i * 4.4 + 2) * 70,
        size: 14 + seededRandom(i * 2.9) * 18,
        delay: seededRandom(i * 6.6) * 5,
        duration: 5 + seededRandom(i * 3.3) * 4,
      })),
    [heartCount]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-royal/40 blur-[90px] animate-glowPulse" />
      <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-blush/30 blur-[90px] animate-glowPulse [animation-delay:1.5s]" />

      {/* Stars */}
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Floating hearts */}
      {showHearts &&
        hearts.map((h, i) => (
          <motion.span
            key={`heart-${i}`}
            className="absolute select-none text-blush/70"
            style={{ left: `${h.left}%`, top: `${h.top}%`, fontSize: h.size }}
            animate={{ y: [0, -20, 0], opacity: [0.4, 0.9, 0.4] }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ❤
          </motion.span>
        ))}
    </div>
  );
}
