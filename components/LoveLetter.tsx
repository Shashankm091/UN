"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { siteConfig } from "@/lib/config";

export default function LoveLetter() {
  const { salutation, body, signOff } = siteConfig.loveLetter;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setTyped(body.slice(0, i));
      if (i >= body.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [inView, body]);

  return (
    <div
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center bg-midnight2 px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, rotateX: -90 }}
        whileInView={{ opacity: 1, rotateX: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "top center" }}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/95 to-white/90 p-10 shadow-2xl shadow-royal/20 md:p-14"
      >
        <p className="font-hand text-2xl text-royal">{salutation}</p>
        <p className="mt-6 whitespace-pre-line font-hand text-xl leading-relaxed text-midnight2/90">
          {typed}
          <span className="animate-pulse">|</span>
        </p>
        {typed.length >= body.length && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="mt-8 text-right font-hand text-3xl text-royal"
          >
            {signOff}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
