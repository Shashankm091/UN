"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

function FlipCard({ index, reason }: { index: number; reason: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      aria-label={`Reason ${index + 1}`}
      className="relative h-40 w-full [perspective:1000px]"
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-royal/30 to-blush/20 backdrop-blur-lg [backface-visibility:hidden]">
          <span className="font-display text-3xl text-white">{String(index + 1).padStart(2, "0")}</span>
          <span className="mt-1 text-xs text-white/50">tap to reveal</span>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl border border-white/15 bg-white/95 p-4 text-center [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          <p className="font-hand text-lg leading-snug text-midnight2">{reason}</p>
        </div>
      </motion.div>
    </button>
  );
}

export default function ReasonsGrid() {
  const reasons = siteConfig.reasons;

  return (
    <div className="w-full bg-midnight2 px-6 py-24">
      <h2 className="mb-3 text-center font-display text-3xl text-white md:text-4xl">
        {reasons.length} Reasons I Love You
      </h2>
      <p className="mb-12 text-center font-body text-sm text-white/50">
        Tap each card to reveal
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {reasons.map((reason, i) => (
          <FlipCard key={i} index={i} reason={reason} />
        ))}
      </div>
    </div>
  );
}
