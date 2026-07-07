"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function RibbonThread() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  return (
    <div className="pointer-events-none fixed left-4 top-0 z-40 hidden h-full w-6 md:left-8 md:block lg:left-12">
      <svg
        className="h-full w-full"
        viewBox="0 0 24 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* track */}
        <path
          d="M12 0 C 4 120, 20 220, 12 340 S 4 560, 12 680 S 20 880, 12 1000"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* animated glowing thread */}
        <motion.path
          d="M12 0 C 4 120, 20 220, 12 340 S 4 560, 12 680 S 20 880, 12 1000"
          stroke="url(#ribbonGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        <defs>
          <linearGradient id="ribbonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD6E8" />
            <stop offset="50%" stopColor="#C9A9E9" />
            <stop offset="100%" stopColor="#9B6FD9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
