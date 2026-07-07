// =============================================================
// 💖 EDIT EVERYTHING HERE — no need to touch any component code
// =============================================================

import { GiftOption } from "@/types";

export const siteConfig = {
  // ---- People ----
  girlName: "My Love",
  fromName: "Your Person",

  // ---- Dates ----
  birthdayDate: "2026-08-15", // YYYY-MM-DD, used by the countdown

  // ---- Landing screen copy ----
  landing: {
    greeting: "Hey love ❤️",
    subtitle: "I have something special for you...",
    prompt: "Choose your surprise",
    tapHint: "Tap anywhere ❤️",
  },

  // ---- The three gift options ----
  gifts: [
    {
      id: "memories",
      title: "Birthday Memories",
      subtitle: "Every moment, replayed",
      icon: "gift",
    },
    {
      id: "letter",
      title: "Message From My Heart",
      subtitle: "Words I've been saving",
      icon: "heart",
    },
    {
      id: "secret",
      title: "Secret Surprise",
      subtitle: "Something just for you",
      icon: "lock",
    },
  ] as GiftOption[],

  // ---- Birthday Memories slideshow ----
  memories: {
    images: [
      { src: "/assets/images/memory-u-1.jpg", alt: "Memory 1" },
      { src: "/assets/images/memory-u-2.jpg", alt: "Memory 2" },
      { src: "/assets/images/memory-u-3.jpg", alt: "Memory 3" },
      { src: "/assets/images/memory-u-4.jpg", alt: "Memory 4" },
      { src: "/assets/images/memory-u-5.jpg", alt: "Memory 5" },
      { src: "/assets/images/memory-u-6.jpg", alt: "Memory 6" },
      { src: "/assets/images/memory-u-7.jpg", alt: "Memory 7" },
      { src: "/assets/images/memory-u-8.jpg", alt: "Memory 8" },
      { src: "/assets/images/memory-u-10.jpg", alt: "Memory 10" },
      { src: "/assets/images/memory-u-11.jpg", alt: "Memory 11" },
      { src: "/assets/images/memory-u-12.jpg", alt: "Memory 12" },
      { src: "/assets/images/memory-u-13.jpg", alt: "Memory 13" },
      { src: "/assets/images/memory-u-14.jpg", alt: "Memory 14" },
      { src: "/assets/images/memory-u-15.jpg", alt: "Memory 15" },
      { src: "/assets/images/memory-u-16.jpg", alt: "Memory 16" },
      { src: "/assets/images/memory-u-17.jpg", alt: "Memory 17" },
      { src: "/assets/images/memory-u-18.jpg", alt: "Memory 18" },
      { src: "/assets/images/memory-u-19.jpg", alt: "Memory 19" },
    ],
    quotes: [
      "You are my favorite chapter.",
      "Every memory with you is my treasure.",
      "I'm lucky to have you.",
      "Forever begins with you.",
      "Home isn't a place, it's you.",
      "You turned ordinary days into memories.",
    ],
  },

  // ---- Happy Birthday hero words ----
  birthdayWords: ["My Softie", "My Princess", "My Love", "My Everything"],

  // ---- Love letter ----
  loveLetter: {
    salutation: "My Dearest Love,",
    body: `I don't know where to begin, except to say that knowing you has been the softest, warmest thing to ever happen to me.

You make ordinary days feel like they matter. You make distance feel smaller and time feel kinder. Every little thing about you — the way you laugh, the way you care, the way you show up — it all adds up to someone I am endlessly grateful for.

Today is about you. All of you. The parts you show the world and the quiet parts only I get to see. I hope this year hands you every soft, golden thing you deserve.

Thank you for being exactly who you are.`,
    signOff: "I Love You ❤️",
  },

  // ---- Timeline ----
  timeline: [
    { label: "First Meet", detail: "Where it all began", date: "" },
    { label: "First Chat", detail: "The conversation that didn't end", date: "" },
    { label: "First Call", detail: "Hearing your voice for the first time", date: "" },
    { label: "First Selfie", detail: "Proof we existed in the same frame", date: "" },
    { label: "Best Memory", detail: "The one we still talk about", date: "" },
    { label: "Today", detail: "Still choosing you", date: "" },
    { label: "Future Together ❤️", detail: "Everything still to come", date: "" },
  ],

  // ---- 20 Reasons I Love You (flip cards) ----
  reasons: [
    "Your laugh is my favorite sound.",
    "You make hard days feel lighter.",
    "You remember the little things.",
    "You believe in me, even when I don't.",
    "Your hugs feel like home.",
    "You're kind to people who can't repay you.",
    "You make distance feel small.",
    "You're the first person I want to tell things to.",
    "You never make me feel silly for feeling things.",
    "You're effortlessly beautiful.",
    "You try, even when it's hard.",
    "You forgive easily.",
    "You make future plans with me.",
    "Your voice calms me down.",
    "You know exactly how to cheer me up.",
    "You're my favorite person to do nothing with.",
    "You love fiercely.",
    "You make me want to be better.",
    "You're patient with me.",
    "You're simply, irreplaceably you.",
  ],

  // ---- Memory Gallery (Pinterest-style) ----
  gallery: {
    images: Array.from({ length: 16 }, (_, i) => ({
      src: `/assets/images/gallery-${(i % 8) + 1}.jpg`,
      alt: `Gallery photo ${i + 1}`,
    })),
  },

  // ---- Floating love notes ----
  loveNotes: [
    "You make me smile.",
    "You are my safe place.",
    "You are my happiness.",
    "I'll always choose you.",
    "You're worth every mile between us.",
    "You're my favorite hello and hardest goodbye.",
  ],

  // ---- Secret surprise ----
  secret: {
    password: "boni",
    unlockedMessage: "I have one more surprise for you ❤️",
    images: [
      { src: "/assets/images/secret-u-1.jpg", alt: "Secret memory 1" },
      { src: "/assets/images/secret-u-2.jpg", alt: "Secret memory 2" },
      { src: "/assets/images/secret-u-3.jpg", alt: "Secret memory 3" },
      { src: "/assets/images/secret-u-4.jpg", alt: "Secret memory 4" },
      { src: "/assets/images/secret-u-5.jpg", alt: "Secret memory 5" },
      { src: "/assets/images/secret-u-6.jpg", alt: "Secret memory 6" },
      { src: "/assets/images/secret-u-7.jpg", alt: "Secret memory 7" },
      { src: "/assets/images/secret-u-8.jpg", alt: "Secret memory 8" },
    ],
  },

  // ---- Final screen ----
  finale: {
    lines: [
      "No matter where life takes us...",
      "I'll always choose you.",
      "Happy Birthday ❤️",
      "I Love You Forever",
    ],
  },

  // ---- Music ----
  music: {
    src: "/assets/music/custom-song.mp3", // your uploaded song
    loop: true,
    defaultVolume: 0.4,
  },

  // ---- Theme colors (also mirrored in tailwind.config.ts) ----
  theme: {
    midnight: "#0F0A1F",
    blush: "#FFD6E8",
    lavender: "#C9A9E9",
    royal: "#9B6FD9",
    gold: "#FFE8B8",
  },
};

export type SiteConfig = typeof siteConfig;
