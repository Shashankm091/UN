"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function RelationshipTimeline() {
  const items = siteConfig.timeline;

  return (
    <div className="relative w-full bg-midnight px-6 py-24">
      <h2 className="mb-16 text-center font-display text-3xl text-white md:text-4xl">
        Our Story So Far
      </h2>

      <div className="relative mx-auto max-w-xl">
        {/* connecting glow line */}
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-blush via-lavender to-royal md:left-1/2 md:-translate-x-1/2" />

        <div className="flex flex-col gap-10">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex items-center gap-4 pl-10 md:w-1/2 md:pl-0 ${
                i % 2 === 0 ? "md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
              }`}
            >
              <span className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-royal shadow-[0_0_12px_rgba(155,111,217,0.9)] md:left-auto md:right-[-1.6rem] md:top-1.5" 
                style={i % 2 !== 0 ? { left: "-1.6rem", right: "auto" } : {}}
              />
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-lg">
                <p className="font-display text-lg text-white">{item.label}</p>
                <p className="mt-1 font-body text-sm text-white/60">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
