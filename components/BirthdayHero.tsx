"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AmbientBackground from "./AmbientBackground";
import { siteConfig } from "@/lib/config";
import { burstConfetti } from "@/animations/celebration";

function TypewriterWord({ word }: { word: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(word.slice(0, i));
      if (i >= word.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, [word]);

  return <span>{displayed}</span>;
}

export default function BirthdayHero() {
  const words = siteConfig.birthdayWords;
  const [wordIndex, setWordIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    burstConfetti();
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [inView, words.length]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-midnight px-6 text-center"
    >
      <AmbientBackground density="medium" />
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 font-display text-5xl text-white drop-shadow-[0_0_25px_rgba(155,111,217,0.6)] md:text-7xl"
      >
        Happy Birthday ❤️
      </motion.h2>

      <div className="relative z-10 mt-6 h-16">
        <motion.p
          key={wordIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-hand text-3xl text-blush md:text-4xl"
        >
          <TypewriterWord word={words[wordIndex]} />
          <span className="animate-pulse">|</span>
        </motion.p>
      </div>
    </div>
  );
}
