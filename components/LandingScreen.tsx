"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiGift, FiHeart, FiLock } from "react-icons/fi";
import AmbientBackground from "./AmbientBackground";
import { siteConfig } from "@/lib/config";
import { GiftOption } from "@/types";

const icons = {
  gift: FiGift,
  heart: FiHeart,
  lock: FiLock,
};

interface LandingScreenProps {
  onSelect: (id: string) => void;
}

export default function LandingScreen({ onSelect }: LandingScreenProps) {
  const [step, setStep] = useState(0);
  const { greeting, subtitle, prompt, tapHint } = siteConfig.landing;

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1200),
      setTimeout(() => setStep(2), 2600),
      setTimeout(() => setStep(3), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-midnight px-6 text-center">
      <AmbientBackground density="high" />

      <div className="relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h1
              key="greeting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl text-white md:text-6xl"
            >
              {greeting}
            </motion.h1>
          )}
          {step === 1 && (
            <motion.h2
              key="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="font-body text-xl text-blush/90 md:text-2xl"
            >
              {subtitle}
            </motion.h2>
          )}
        </AnimatePresence>

        {step >= 2 && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-2xl text-white md:text-3xl"
          >
            {prompt}
          </motion.h2>
        )}

        {step >= 3 && (
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {siteConfig.gifts.map((gift: GiftOption) => {
              const Icon = icons[gift.icon];
              return (
                <motion.button
                  key={gift.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                  whileHover={{ y: -8, scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onSelect(gift.id)}
                  className="group relative flex w-56 flex-col items-center gap-3 rounded-3xl border border-white/15 bg-white/5 px-6 py-8 backdrop-blur-xl transition-shadow hover:shadow-[0_0_40px_rgba(155,111,217,0.5)]"
                >
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-3xl bg-royal/20 blur-xl"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blush/30 to-royal/40 text-white"
                  >
                    <Icon size={28} />
                  </motion.div>
                  <span className="font-display text-lg text-white">{gift.title}</span>
                  <span className="font-body text-sm text-white/60">{gift.subtitle}</span>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {step >= 3 && (
        <motion.p
          className="absolute bottom-10 font-hand text-lg text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          {tapHint}
        </motion.p>
      )}
    </section>
  );
}
