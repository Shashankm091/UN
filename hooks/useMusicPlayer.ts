"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import { saveSongToDB, loadSongFromDB, removeSongFromDB } from "@/lib/musicStorage";

// Custom events dispatched by MemoryGallery video cards
export const MUSIC_PAUSE_EVENT = "bg-music-pause";
export const MUSIC_RESUME_EVENT = "bg-music-resume";

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null); // track created blob URLs for cleanup

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(siteConfig.music.defaultVolume);
  const [hasStarted, setHasStarted] = useState(false);
  const [customSong, setCustomSong] = useState<{ src: string; name: string } | null>(null);
  const [loadingDB, setLoadingDB] = useState(true);

  // ── Load saved song from IndexedDB on mount ──────────────────────────────
  useEffect(() => {
    loadSongFromDB().then((saved) => {
      if (saved) {
        blobUrlRef.current = saved.src;
        setCustomSong(saved);
      }
      setLoadingDB(false);
    });
    return () => {
      // Revoke any blob URL on unmount to free memory
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, []);

  const activeSrc = customSong?.src ?? siteConfig.music.src;
  const activeName = customSong?.name ?? "Background Music";

  // ── Create / recreate audio element when src changes ────────────────────
  useEffect(() => {
    if (loadingDB) return; // wait until we know which src to use
    const audio = new Audio(activeSrc);
    audio.loop = siteConfig.music.loop;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    if (isPlaying) audio.play().catch(() => {});

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSrc, loadingDB]);

  // ── Sync volume / mute ───────────────────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Autoplay on first user interaction ──────────────────────────────────
  useEffect(() => {
    if (hasStarted || loadingDB) return;
    const startOnInteract = () => {
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
      setHasStarted(true);
      window.removeEventListener("click", startOnInteract);
      window.removeEventListener("keydown", startOnInteract);
    };
    window.addEventListener("click", startOnInteract);
    window.addEventListener("keydown", startOnInteract);
    return () => {
      window.removeEventListener("click", startOnInteract);
      window.removeEventListener("keydown", startOnInteract);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, loadingDB]);

  // ── Listen for video play / stop events from MemoryGallery ──────────────
  useEffect(() => {
    const handleVideoPause = () => {
      // A video started playing — duck/pause background music
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        // Do NOT update isPlaying so music resumes correctly afterward
      }
    };
    const handleVideoResume = () => {
      // Video stopped — resume background music if it was playing
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };
    window.addEventListener(MUSIC_PAUSE_EVENT, handleVideoPause);
    window.addEventListener(MUSIC_RESUME_EVENT, handleVideoResume);
    return () => {
      window.removeEventListener(MUSIC_PAUSE_EVENT, handleVideoPause);
      window.removeEventListener(MUSIC_RESUME_EVENT, handleVideoResume);
    };
  }, [isPlaying]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  // ── Upload song → IndexedDB ───────────────────────────────────────────────
  const uploadSong = useCallback(async (file: File) => {
    // Revoke old blob URL
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    const name = await saveSongToDB(file);
    // Reload from DB to get a fresh blob URL
    const saved = await loadSongFromDB();
    if (saved) {
      blobUrlRef.current = saved.src;
      setCustomSong(saved);
    } else {
      setCustomSong({ src: URL.createObjectURL(file), name });
    }
  }, []);

  // ── Remove custom song ────────────────────────────────────────────────────
  const removeSong = useCallback(async () => {
    await removeSongFromDB();
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setCustomSong(null);
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    setVolume,
    play,
    pause,
    toggle,
    toggleMute,
    uploadSong,
    removeSong,
    activeName,
    hasCustomSong: !!customSong,
  };
}
