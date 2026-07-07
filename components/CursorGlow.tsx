"use client";

import { useEffect, useRef, useState } from "react";

interface TrailHeart {
  id: number;
  x: number;
  y: number;
}

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [hearts, setHearts] = useState<TrailHeart[]>([]);
  const idRef = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch devices

    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
      }

      const now = Date.now();
      if (now - lastSpawn.current > 120) {
        lastSpawn.current = now;
        const id = idRef.current++;
        setHearts((prev) => [...prev.slice(-12), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== id));
        }, 900);
      }
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] hidden md:block">
      <div
        ref={glowRef}
        className="absolute h-[300px] w-[300px] rounded-full bg-royal/10 blur-[60px] transition-transform duration-200 ease-out"
      />
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-[fadeUp_0.9s_ease-out_forwards] text-sm text-blush/80"
          style={{ left: h.x, top: h.y }}
        >
          ❤
        </span>
      ))}
      <style jsx global>{`
        @keyframes fadeUp {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(0.6);
          }
        }
      `}</style>
    </div>
  );
}
