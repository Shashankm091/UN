"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function LoadingScreen({ onFinish }: { onFinish?: () => void }) {
  const [visible, setVisible] = useState(true);
  const calledRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish && !calledRef.current) {
        calledRef.current = true;
        onFinish();
      }
    }, 2200);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-midnight"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-5xl"
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          >
            💌
          </motion.div>
          <motion.p
            className="mt-6 font-hand text-2xl text-blush/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            wrapping something special...
          </motion.p>
          <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-blush via-lavender to-royal"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
