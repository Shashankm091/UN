"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiUnlock, FiUpload, FiTrash2, FiPlus, FiEdit2, FiX, FiRotateCcw, FiImage } from "react-icons/fi";
import { siteConfig } from "@/lib/config";
import { burstConfetti } from "@/animations/celebration";
import {
  loadImagesFromDB,
  saveImageToDB,
  replaceImageInDB,
  deleteImageFromDB,
  clearAllImagesFromDB,
  type LoadedImage,
} from "@/lib/imageStorage";

const STORE = "secret-surprise-images";

// ── Single image card ──────────────────────────────────────────────────────────
function ImageCard({
  img,
  index,
  editOpen,
  onReplace,
  onRemove,
}: {
  img: LoadedImage | null; // null = default placeholder slot
  index: number;
  editOpen: boolean;
  onReplace: (index: number, id: number | null) => void;
  onRemove: (id: number) => void;
}) {
  const defaultImg = siteConfig.secret.images[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-gold/40"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.src} alt={img.name} className="h-full w-full object-cover" />
      ) : (
        // Default placeholder
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={defaultImg?.src ?? ""}
          alt={defaultImg?.alt ?? `Memory ${index + 1}`}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
        />
      )}

      {/* Edit overlay */}
      {editOpen && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 backdrop-blur-[2px]">
          <button
            title="Replace"
            onClick={() => onReplace(index, img?.id ?? null)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-purple-600"
          >
            <FiUpload size={14} />
          </button>
          {img && (
            <button
              title="Remove"
              onClick={() => onRemove(img.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-red-500"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SecretSurprise() {
  const { password, unlockedMessage } = siteConfig.secret;
  const totalSlots = siteConfig.secret.images.length; // 8

  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // Persisted images (IndexedDB)
  const [customImages, setCustomImages] = useState<LoadedImage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // We track which slot/id is being replaced
  const replacingRef = useRef<{ slotIndex: number; id: number | null } | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  // Load from IndexedDB on mount
  useEffect(() => {
    loadImagesFromDB(STORE).then((imgs) => {
      setCustomImages(imgs);
      setLoaded(true);
    });
  }, []);

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === password.toLowerCase()) {
      setUnlocked(true);
      setError(false);
      burstConfetti();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  // Add new images (fills empty slots first, then appends)
  const handleAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const newImgs: LoadedImage[] = [];
    for (const file of files) {
      const saved = await saveImageToDB(STORE, file);
      newImgs.push(saved);
    }
    setCustomImages((prev) => [...prev, ...newImgs]);
    setUploading(false);
    e.target.value = "";
  };

  // Replace a specific slot
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingRef.current) return;
    setUploading(true);
    const { id } = replacingRef.current;
    if (id !== null) {
      // Replace existing custom image
      const updated = await replaceImageInDB(STORE, id, file);
      setCustomImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
    } else {
      // Slot was a default placeholder — just add a new image
      const saved = await saveImageToDB(STORE, file);
      setCustomImages((prev) => [...prev, saved]);
    }
    replacingRef.current = null;
    setUploading(false);
    e.target.value = "";
  };

  const handleRemove = async (id: number) => {
    await deleteImageFromDB(STORE, id);
    setCustomImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = async () => {
    if (!confirm("Remove all custom images and revert to defaults?")) return;
    await clearAllImagesFromDB(STORE);
    setCustomImages([]);
  };

  const handleReplaceClick = (slotIndex: number, id: number | null) => {
    replacingRef.current = { slotIndex, id };
    replaceInputRef.current?.click();
  };

  // Build the display grid: custom images fill slots first, rest are defaults
  const displaySlots: (LoadedImage | null)[] = Array.from({ length: Math.max(totalSlots, customImages.length) }, (_, i) =>
    customImages[i] ?? null
  );

  if (!loaded && unlocked) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-midnight px-6 py-24 text-center">
      {/* Hidden file inputs */}
      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFile} />
      <input ref={addInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddFiles} />

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.form
            key="lock"
            onSubmit={tryUnlock}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: error ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-white/15 bg-white/5 p-10 backdrop-blur-xl"
          >
            <FiLock size={36} className="text-blush" />
            <h2 className="font-display text-2xl text-white">Secret Surprise</h2>
            <p className="font-body text-sm text-white/60">Enter the password to unlock it</p>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Password"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-center text-white placeholder-white/40 outline-none focus:border-royal"
            />
            <button
              type="submit"
              className="rounded-full bg-royal px-8 py-3 font-body text-white transition hover:bg-royal/80"
            >
              Unlock
            </button>
            {error && <p className="text-sm text-blush">Not quite — try again 💗</p>}
          </motion.form>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex w-full max-w-4xl flex-col items-center gap-8"
          >
            <FiUnlock size={32} className="text-gold" />
            <h2 className="font-display text-2xl text-white md:text-3xl">{unlockedMessage}</h2>

            {/* Edit toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setEditOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-sm transition hover:bg-white/20"
              >
                {editOpen ? <FiX size={13} /> : <FiEdit2 size={13} />}
                {editOpen ? "Done Editing" : "Edit Photos"}
              </button>
              {editOpen && (
                <>
                  <button
                    onClick={() => addInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-full border border-white/20 bg-purple-600/30 px-4 py-2 text-xs text-white transition hover:bg-purple-600/50 disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                    ) : (
                      <FiPlus size={13} />
                    )}
                    Add Photos
                  </button>
                  {customImages.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/60 transition hover:bg-white/20"
                    >
                      <FiRotateCcw size={13} /> Reset to Default
                    </button>
                  )}
                </>
              )}
            </div>

            {editOpen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-white/40"
              >
                <FiImage size={11} className="mr-1 inline" />
                Click upload icon on any photo to replace it · Photos saved permanently
              </motion.p>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {displaySlots.map((img, i) => (
                <ImageCard
                  key={img ? img.id : `default-${i}`}
                  img={img}
                  index={i}
                  editOpen={editOpen}
                  onReplace={handleReplaceClick}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
