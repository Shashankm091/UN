"use client";

import { useRef, useState } from "react";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMusic,
  FiUpload,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicControls() {
  const {
    isPlaying,
    isMuted,
    volume,
    setVolume,
    toggle,
    toggleMute,
    uploadSong,
    removeSong,
    activeName,
    hasCustomSong,
  } = useMusicPlayer();

  const [panelOpen, setPanelOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await uploadSong(file);
    setUploading(false);
    setJustUploaded(true);
    setTimeout(() => setJustUploaded(false), 2500);
    e.target.value = "";
  };

  return (
    <>
      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* floating music bar */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

        {/* ── SONG UPLOAD PANEL ── */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="w-72 rounded-2xl border border-white/15 bg-[#1a1030]/90 p-4 shadow-2xl shadow-royal/30 backdrop-blur-xl"
            >
              {/* panel header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  <FiMusic size={14} className="text-blush" />
                  Background Music
                </span>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* current song name */}
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    hasCustomSong ? "bg-purple-600" : "bg-white/10"
                  }`}
                >
                  <FiMusic size={13} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white/90">{activeName}</p>
                  <p className="text-[10px] text-white/40">
                    {hasCustomSong ? "Your custom song" : "Default track"}
                  </p>
                </div>
                {isPlaying && (
                  <span className="flex gap-0.5">
                    {[1, 2, 3].map((b) => (
                      <span
                        key={b}
                        className="w-0.5 rounded-full bg-blush"
                        style={{
                          height: `${8 + b * 3}px`,
                          animation: `bounce ${0.6 + b * 0.15}s ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                  </span>
                )}
              </div>

              {/* upload button */}
              <button
                id="music-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-purple-400/50 bg-purple-600/10 py-3 text-sm text-purple-300 transition hover:border-purple-400 hover:bg-purple-600/20 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-400 border-t-transparent" />
                    Loading…
                  </>
                ) : justUploaded ? (
                  <>
                    <FiCheck size={15} className="text-green-400" />
                    <span className="text-green-400">Song ready!</span>
                  </>
                ) : (
                  <>
                    <FiUpload size={15} />
                    {hasCustomSong ? "Replace Song" : "Upload Your Song"}
                  </>
                )}
              </button>

              <p className="mb-3 text-center text-[10px] text-white/30">
                Supports MP3, WAV, OGG, AAC · Saved in your browser
              </p>

              {/* remove custom song */}
              {hasCustomSong && (
                <button
                  onClick={() => {
                    if (confirm("Remove your custom song and revert to default?")) {
                      removeSong();
                    }
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-xs text-white/50 transition hover:border-red-500/40 hover:text-red-400"
                >
                  <FiTrash2 size={11} /> Remove custom song
                </button>
              )}

              {/* volume slider */}
              <div className="mt-3 flex items-center gap-2">
                <FiVolume2 size={13} className="shrink-0 text-white/40" />
                <input
                  aria-label="Volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-royal"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FLOATING PILL ── */}
        <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-2 shadow-lg shadow-royal/20 backdrop-blur-xl">
          {/* play/pause */}
          <button
            aria-label={isPlaying ? "Pause music" : "Play music"}
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-royal/70 text-white transition hover:bg-royal"
          >
            {isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
          </button>

          {/* mute */}
          <button
            aria-label={isMuted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="flex h-9 w-9 items-center justify-center rounded-full text-blush/90 transition hover:text-white"
          >
            {isMuted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </button>

          {/* open panel */}
          <button
            id="music-settings-btn"
            aria-label="Music settings"
            onClick={() => setPanelOpen((v) => !v)}
            title="Upload your song"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
              panelOpen
                ? "bg-purple-600 text-white"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            } ${hasCustomSong ? "text-blush" : ""}`}
          >
            <FiMusic size={15} />
          </button>
        </div>
      </div>

      {/* bouncing bars keyframe */}
      <style>{`
        @keyframes bounce {
          from { transform: scaleY(0.5); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </>
  );
}
