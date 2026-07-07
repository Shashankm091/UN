# 💌 Birthday Surprise Website

A romantic, animated birthday surprise site — built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

Inspired by the feeling of the reference video (a personal "choose your surprise" style birthday page), rebuilt from scratch as its own implementation.

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**.

No backend, no database, no API keys — everything runs locally.

## Customize everything from one file

Open **`lib/config.ts`**. That's the only file you need to touch to make this yours:

- `girlName`, `fromName` — names
- `birthdayDate` — powers the countdown
- `landing` — the opening greeting text
- `gifts` — the 3 choices on the landing screen
- `memories.images` / `memories.quotes` — the cinematic slideshow
- `birthdayWords` — the words that type out under "Happy Birthday"
- `loveLetter` — the handwritten letter text
- `timeline` — your relationship milestones
- `reasons` — the 20 flip-card reasons
- `gallery.images` — the Pinterest-style gallery
- `loveNotes` — the floating clickable notes
- `secret` — the password-protected surprise (default password: `birthday`)
- `finale.lines` — the closing message sequence
- `music` — background track path, volume, loop

## Replacing images & music

Drop your own files into:

```
public/assets/images/   → replace memory-1.jpg, gallery-1.jpg, secret-1.jpg, etc.
public/assets/music/    → replace background.mp3
```

Filenames are referenced from `lib/config.ts`, so just keep the same names (or update the paths in the config) — no component code needs to change.

The images currently in place are soft-gradient **placeholders** so the site looks and runs correctly out of the box. Swap them for real photos whenever you're ready.

## Project structure

```
app/            → Next.js App Router entry (layout.tsx, page.tsx, globals.css)
components/     → every section as its own component
hooks/          → useMusicPlayer, useCountdown, useReducedMotion
lib/config.ts   → your single source of truth for content
animations/     → confetti & fireworks helpers
types/          → shared TypeScript types
public/assets/  → images & music
```

## Notes

- Fonts (Playfair Display, Quicksand, Caveat) load from Google Fonts at runtime via a `<link>` tag, so `npm run build` never needs network access — only your visitor's browser does.
- Respects `prefers-reduced-motion`.
- Right-click/download is disabled on gallery and secret images (a soft deterrent, not real DRM).
- The secret surprise password lives in `lib/config.ts` as plain text — fine for a personal gift link, not meant for real security.

Made with ❤️ for someone's birthday.
