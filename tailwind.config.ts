import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0F0A1F",
        midnight2: "#170F2E",
        blush: "#FFD6E8",
        lavender: "#C9A9E9",
        royal: "#9B6FD9",
        gold: "#FFE8B8",
        glass: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Quicksand"', "ui-sans-serif", "system-ui", "sans-serif"],
        hand: ['"Caveat"', "cursive"],
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-18px) translateX(6px)" },
        },
        floatySlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.55", filter: "blur(30px)" },
          "50%": { opacity: "0.9", filter: "blur(40px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        ribbonDraw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        floatySlow: "floatySlow 8s ease-in-out infinite",
        glowPulse: "glowPulse 4s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(circle at 50% 30%, rgba(155,111,217,0.35), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
