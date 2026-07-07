"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { siteConfig } from "@/lib/config";

export default function BirthdayCountdown() {
  const { days, hours, minutes, seconds, isPast } = useCountdown(siteConfig.birthdayDate);

  if (isPast) return null;

  const units = [
    { label: "days", value: days },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  return (
    <div className="flex w-full justify-center bg-midnight py-8">
      <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-lg">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center px-2">
            <span className="font-display text-2xl text-blush">{String(u.value).padStart(2, "0")}</span>
            <span className="text-[10px] uppercase tracking-wide text-white/40">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
