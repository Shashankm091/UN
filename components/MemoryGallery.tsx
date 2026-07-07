"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiEdit2,
  FiUpload,
  FiTrash2,
  FiPlus,
  FiPlay,
  FiPause,
  FiMaximize2,
  FiRotateCcw,
  FiVideo,
} from "react-icons/fi";
import { MUSIC_PAUSE_EVENT, MUSIC_RESUME_EVENT } from "@/hooks/useMusicPlayer";
import {
  loadVideosFromDB,
  saveVideoToDB,
  replaceVideoInDB,
  deleteVideoFromDB,
  clearAllVideosFromDB,
} from "@/lib/videoStorage";

type VideoItem = {
  id: number;   // IndexedDB key
  src: string;  // blob URL
  name: string;
};

// ── single video card ──────────────────────────────────────────────────────────
function VideoCard({
  video,
  index,
  editOpen,
  onReplace,
  onRemove,
  onExpand,
}: {
  video: VideoItem;
  index: number;
  editOpen: boolean;
  onReplace: (id: number) => void;
  onRemove: (id: number) => void;
  onExpand: (index: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    videoRef.current.volume = 0.85;
    videoRef.current.play().catch(() => {});
    setPlaying(true);
    window.dispatchEvent(new CustomEvent(MUSIC_PAUSE_EVENT));
  };

  const handleMouseLeave = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setPlaying(false);
    window.dispatchEvent(new CustomEvent(MUSIC_RESUME_EVENT));
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
      window.dispatchEvent(new CustomEvent(MUSIC_RESUME_EVENT));
    } else {
      videoRef.current.muted = false;
      videoRef.current.volume = 0.85;
      videoRef.current.play().catch(() => {});
      setPlaying(true);
      window.dispatchEvent(new CustomEvent(MUSIC_PAUSE_EVENT));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/30"
      style={{ aspectRatio: "9/16" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={video.src}
        loop
        playsInline
        muted
        className="h-full w-full object-cover"
        onEnded={() => {
          setPlaying(false);
          window.dispatchEvent(new CustomEvent(MUSIC_RESUME_EVENT));
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

      <p className="absolute bottom-3 left-3 right-3 truncate text-xs font-medium text-white/80">
        {video.name}
      </p>

      <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={togglePlay}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-royal"
        >
          {playing ? <FiPause size={18} /> : <FiPlay size={18} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(index); }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40"
        >
          <FiMaximize2 size={14} />
        </button>
      </div>

      {editOpen && (
        <div className="absolute right-2 top-2 flex gap-1.5">
          <button
            title="Replace"
            onClick={(e) => { e.stopPropagation(); onReplace(video.id); }}
            className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-purple-600"
          >
            <FiUpload size={12} />
          </button>
          <button
            title="Remove"
            onClick={(e) => { e.stopPropagation(); onRemove(video.id); }}
            className="rounded-full bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-red-500"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── main component ─────────────────────────────────────────────────────────────
export default function MemoryGallery() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [expandIndex, setExpandIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // Load from IndexedDB on mount, fall back to default public videos
  useEffect(() => {
    loadVideosFromDB().then((v) => {
      if (v.length > 0) {
        setVideos(v);
      } else {
        // Default videos embedded in public folder — visible to everyone
        setVideos([
          { id: -1, src: "/assets/videos/memory-1.mp4", name: "Our Memory 1" },
          { id: -2, src: "/assets/videos/memory-2.mp4", name: "Our Memory 2" },
          { id: -3, src: "/assets/videos/memory-3.mp4", name: "Our Memory 3" },
          { id: -4, src: "/assets/videos/memory-4.mp4", name: "Our Memory 4" },
          { id: -5, src: "/assets/videos/memory-5.mp4", name: "Our Memory 5" },
        ]);
      }
      setLoaded(true);
    });
  }, []);

  // Add multiple videos
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const newItems: VideoItem[] = [];
    for (const file of files) {
      const item = await saveVideoToDB(file);
      newItems.push(item);
    }
    setVideos((prev) => [...prev, ...newItems]);
    setUploading(false);
    e.target.value = "";
  };

  // Replace one video
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingId === null) return;
    setUploading(true);
    const updated = await replaceVideoInDB(replacingId, file);
    setVideos((prev) =>
      prev.map((v) => (v.id === replacingId ? updated : v))
    );
    setReplacingId(null);
    setUploading(false);
    e.target.value = "";
  };

  const removeVideo = async (id: number) => {
    await deleteVideoFromDB(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const clearAll = async () => {
    if (!confirm("Remove all videos?")) return;
    await clearAllVideosFromDB();
    setVideos([]);
  };

  const handleReplaceClick = (id: number) => {
    setReplacingId(id);
    fileInputRef.current?.click();
  };

  if (!loaded) return null;

  return (
    <div className="w-full bg-midnight px-6 py-24">
      {/* hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4"
        className="hidden"
        onChange={handleReplaceFile}
      />
      <input
        ref={bulkInputRef}
        type="file"
        accept="video/mp4"
        multiple
        className="hidden"
        onChange={handleBulkUpload}
      />

      {/* ── HEADER ── */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
        <h2 className="text-center font-display text-3xl text-white md:text-4xl">
          Lovely Memories 🎬
        </h2>
        <button
          id="videos-edit-btn"
          onClick={() => setEditOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
        >
          {editOpen ? <FiX size={13} /> : <FiEdit2 size={13} />}
          {editOpen ? "Close" : "Edit Videos"}
        </button>
      </div>

      {/* ── EDIT PANEL ── */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-10 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/60">
                Upload MP4 videos to fill your memories wall.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => bulkInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-purple-600/30 px-3 py-1.5 text-xs text-white transition hover:bg-purple-600/50 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                  ) : (
                    <FiPlus size={12} />
                  )}
                  Add Videos
                </button>
                {videos.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/20"
                  >
                    <FiRotateCcw size={12} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {videos.length > 0 && (
              <div className="grid max-h-48 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
                {videos.map((v, i) => (
                  <div key={v.id} className="group relative aspect-[9/16] overflow-hidden rounded-lg border border-white/10 bg-black/30">
                    <video src={v.src} className="h-full w-full object-cover" muted />
                    <p className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-1 py-0.5 text-[8px] text-white/70">
                      {v.name}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <button onClick={() => handleReplaceClick(v.id)} className="rounded-full bg-white/20 p-1 text-white hover:bg-purple-600">
                        <FiUpload size={9} />
                      </button>
                      <button onClick={() => removeVideo(v.id)} className="rounded-full bg-white/20 p-1 text-white hover:bg-red-500">
                        <FiTrash2 size={9} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 text-center text-[10px] text-white/30">
              MP4 only · Saved permanently in your browser · No data sent anywhere
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EMPTY STATE ── */}
      {videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto flex max-w-sm flex-col items-center gap-5 rounded-3xl border border-dashed border-white/20 py-20 text-white/40"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <FiVideo size={36} />
          </div>
          <div className="text-center">
            <p className="mb-1 text-base font-medium text-white/60">No videos yet</p>
            <p className="text-sm">Click &ldquo;Edit Videos&rdquo; above to upload your MP4 memories</p>
          </div>
          <button
            onClick={() => { setEditOpen(true); setTimeout(() => bulkInputRef.current?.click(), 200); }}
            className="flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-600/20 px-5 py-2.5 text-sm text-purple-300 transition hover:bg-purple-600/30"
          >
            <FiUpload size={14} /> Upload Videos
          </button>
        </motion.div>
      ) : (
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              index={i}
              editOpen={editOpen}
              onReplace={handleReplaceClick}
              onRemove={removeVideo}
              onExpand={setExpandIndex}
            />
          ))}
        </div>
      )}

      {/* ── FULLSCREEN LIGHTBOX ── */}
      <AnimatePresence>
        {expandIndex !== null && videos[expandIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setExpandIndex(null)}
          >
            <button
              aria-label="Close"
              onClick={() => setExpandIndex(null)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <FiX size={20} />
            </button>
            <motion.video
              key={expandIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              src={videos[expandIndex].src}
              controls
              autoPlay
              loop
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] max-w-[92vw] rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
