"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { siteConfig } from "@/lib/config";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function FloatingLoveNotes() {
  const notes = siteConfig.loveNotes;
  const [openNote, setOpenNote] = useState<number | null>(null);

  const positions = useMemo(
    () =>
      notes.map((_, i) => ({
        left: 8 + seededRandom(i * 4.4) * 80,
        top: 10 + seededRandom(i * 8.8 + 3) * 75,
        delay: seededRandom(i * 2.2) * 3,
        duration: 5 + seededRandom(i * 6.1) * 3,
      })),
    [notes]
  );

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden bg-midnight2 px-6 py-24">
      <h2 className="mb-4 text-center font-display text-3xl text-white md:text-4xl">
        Little Love Notes
      </h2>
      <p className="mb-8 text-center font-body text-sm text-white/50">
        Click one to open it
      </p>

      <div className="relative mx-auto h-[420px] max-w-4xl">
        {notes.map((note, i) => (
          <motion.button
            key={i}
            aria-label={`Love note ${i + 1}`}
            onClick={() => setOpenNote(i)}
            className="absolute flex h-14 w-14 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-blush shadow-lg backdrop-blur-md"
            style={{ left: `${positions[i].left}%`, top: `${positions[i].top}%` }}
            animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
            transition={{
              duration: positions[i].duration,
              delay: positions[i].delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{ scale: 1.15 }}
          >
            <FiMail size={22} />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openNote !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            onClick={() => setOpenNote(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm rounded-2xl border border-white/10 bg-white/95 p-8 text-center shadow-2xl"
            >
              <p className="font-hand text-2xl text-midnight2">{notes[openNote]}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
