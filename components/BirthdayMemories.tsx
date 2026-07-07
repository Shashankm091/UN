"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useCustomImages, readFileAsDataURL } from "@/hooks/useCustomImages";
import { FiEdit2, FiUpload, FiTrash2, FiX, FiPlus, FiCheck, FiRotateCcw } from "react-icons/fi";

const variants: Variants[] = [
  { initial: { opacity: 0, scale: 1.3 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.85 } },
  { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  { initial: { opacity: 0, rotate: -12 }, animate: { opacity: 1, rotate: 0 }, exit: { opacity: 0, rotate: 12 } },
  { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 }, exit: { opacity: 0, rotateY: -90 } },
  { initial: { opacity: 0, x: 80 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -80 } },
  { initial: { opacity: 0, y: 40, scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -40 } },
  { initial: { opacity: 0, rotate: 6, y: 30 }, animate: { opacity: 1, rotate: -2, y: 0 }, exit: { opacity: 0, rotate: 8 } },
  { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 30 } },
  { initial: { opacity: 0, rotateX: 40, scale: 0.9 }, animate: { opacity: 1, rotateX: 0, scale: 1 }, exit: { opacity: 0, rotateX: -40 } },
  { initial: { opacity: 0, scale: 0.95, filter: "blur(10px)" }, animate: { opacity: 1, scale: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(10px)" } },
];

export default function BirthdayMemories() {
  const defaultImages = siteConfig.memories.images;
  const { quotes } = siteConfig.memories;

  const { images, loaded, replaceImage, addImages, removeImage, resetImages } =
    useCustomImages("memories-images", defaultImages);

  const SLIDE_DURATION = 4000; // ms per slide

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [replacing, setReplacing] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const startRef = useRef<number>(Date.now());
  const rafRef = useRef<number>(0);

  const showQuote = index > 0 && index % 4 === 0;
  const quote = quotes[(Math.floor(index / 4) - 1) % quotes.length];

  const goNext = () => {
    setIndex((i) => (i + 1) % Math.max(images.length, 1));
    startRef.current = Date.now();
    setProgress(0);
  };

  const goPrev = () => {
    setIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
    startRef.current = Date.now();
    setProgress(0);
  };

  // Auto-advance with RAF-driven progress bar
  useEffect(() => {
    if (editOpen || images.length === 0) return;
    startRef.current = Date.now();
    setProgress(0);

    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= SLIDE_DURATION) {
        setIndex((i) => (i + 1) % images.length);
        startRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [editOpen, images.length]);

  const variant = variants[index % variants.length];

  // --- upload helpers ---
  const handleReplaceClick = (i: number) => {
    setReplacing(i);
    fileInputRef.current?.click();
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacing === null) return;
    const src = await readFileAsDataURL(file);
    replaceImage(replacing, src, `Memory ${replacing + 1}`);
    setReplacing(null);
    e.target.value = "";
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const newImgs = await Promise.all(
      files.map(async (f, i) => ({
        src: await readFileAsDataURL(f),
        alt: `Memory ${images.length + i + 1}`,
        isCustom: true as const,
      }))
    );
    addImages(newImgs);
    e.target.value = "";
  };

  if (!loaded) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-midnight2 px-6 py-24">
      {/* hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceFile}
      />
      <input
        ref={bulkInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleBulkUpload}
      />

      {/* header row */}
      <div className="mb-10 flex items-center gap-4">
        <h2 className="font-display text-3xl text-white md:text-4xl">
          Birthday Memories
        </h2>
        <button
          id="memories-edit-btn"
          onClick={() => setEditOpen((v) => !v)}
          title={editOpen ? "Close editor" : "Edit photos"}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        >
          {editOpen ? <FiX size={13} /> : <FiEdit2 size={13} />}
          {editOpen ? "Close" : "Edit Photos"}
        </button>
      </div>

      {/* ── EDIT PANEL ── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mb-8 w-full max-w-2xl rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
          >
            {/* top toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">
                Click{" "}
                <span className="font-semibold text-white/90">📷</span> on a
                slot to replace it, or add more photos below.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => bulkInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-purple-600/30 px-3 py-1.5 text-xs text-white transition hover:bg-purple-600/50"
                >
                  <FiPlus size={12} /> Add Photos
                </button>
                <button
                  onClick={() => {
                    if (confirm("Reset all photos to defaults?")) resetImages();
                  }}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/20"
                >
                  <FiRotateCcw size={12} /> Reset
                </button>
              </div>
            </div>

            {/* thumbnail grid */}
            <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 md:grid-cols-6">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5"
                >
                  {/* image preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.opacity = "0";
                    }}
                  />

                  {/* custom badge */}
                  {img.isCustom && (
                    <span className="absolute left-1 top-1 rounded-full bg-purple-600 p-0.5">
                      <FiCheck size={8} className="text-white" />
                    </span>
                  )}

                  {/* hover overlay with actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      title="Replace"
                      onClick={() => handleReplaceClick(i)}
                      className="rounded-full bg-white/20 p-1.5 text-white transition hover:bg-purple-600"
                    >
                      <FiUpload size={11} />
                    </button>
                    <button
                      title="Remove"
                      onClick={() => removeImage(i)}
                      className="rounded-full bg-white/20 p-1.5 text-white transition hover:bg-red-500"
                    >
                      <FiTrash2 size={11} />
                    </button>
                  </div>

                  {/* slot number */}
                  <span className="absolute bottom-0.5 right-1 text-[9px] text-white/40">
                    {i + 1}
                  </span>
                </div>
              ))}

              {/* add-new tile */}
              <button
                onClick={() => bulkInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 text-white/30 transition hover:border-purple-400 hover:text-purple-400"
              >
                <FiPlus size={20} />
              </button>
            </div>

            <p className="mt-3 text-center text-[11px] text-white/30">
              Photos are saved in your browser. No data is sent anywhere.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SLIDESHOW ── */}
      <div className="relative flex h-[420px] w-full max-w-md items-center justify-center [perspective:1200px]">
        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="absolute -left-12 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
          >
            ‹
          </button>
        )}
        {/* Next arrow */}
        {images.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute -right-12 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
          >
            ›
          </button>
        )}
        <AnimatePresence mode="wait">
          {showQuote ? (
            <motion.div
              key={`quote-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.7 }}
              className="flex h-full w-full items-center justify-center rounded-3xl border border-white/15 bg-white/5 p-10 text-center backdrop-blur-xl"
            >
              <p className="font-hand text-2xl leading-relaxed text-blush md:text-3xl">
                &ldquo;{quote}&rdquo;
              </p>
            </motion.div>
          ) : images.length > 0 ? (
            <motion.div
              key={`img-${index}`}
              variants={variant}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full overflow-hidden rounded-3xl border-4 border-white bg-white/10 shadow-2xl shadow-royal/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[index % images.length].src}
                alt={images[index % images.length].alt}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-br from-royal/10 to-blush/10 text-white/30">
                <span className="font-body text-sm">
                  {images[index % images.length].alt}
                </span>
              </div>

              {/* quick-replace overlay on current slide */}
              {editOpen && (
                <button
                  onClick={() => handleReplaceClick(index % images.length)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white opacity-0 transition hover:opacity-100"
                >
                  <FiUpload size={32} />
                  <span className="text-sm font-semibold">Replace this photo</span>
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 text-white/40">
              <FiUpload size={40} className="mb-3" />
              <p className="text-sm">Click &ldquo;Edit Photos&rdquo; to add your memories</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Auto-play progress bar */}
      {images.length > 0 && !editOpen && (
        <div className="mt-6 h-0.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blush via-lavender to-royal transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* progress dots */}
      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => { setIndex(i); startRef.current = Date.now(); setProgress(0); }}
              className={`h-1.5 rounded-full transition-all ${
                i === index % images.length
                  ? "w-6 bg-royal"
                  : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
