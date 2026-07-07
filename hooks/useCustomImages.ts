"use client";

import { useState, useEffect, useCallback } from "react";

export type CustomImage = {
  src: string; // base64 data URL or original path
  alt: string;
  isCustom?: boolean;
};

/**
 * Manages a list of images stored in localStorage so user uploads
 * survive page refreshes.
 */
export function useCustomImages(
  storageKey: string,
  defaultImages: CustomImage[]
) {
  const [images, setImages] = useState<CustomImage[]>(defaultImages);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: CustomImage[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setImages(parsed);
        }
      }
    } catch (_) {
      // ignore parse errors
    }
    setLoaded(true);
  }, [storageKey]);

  const save = useCallback(
    (next: CustomImage[]) => {
      setImages(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (_) {
        // storage quota exceeded — skip silently
      }
    },
    [storageKey]
  );

  /** Replace one slot with a new base64 image */
  const replaceImage = useCallback(
    (index: number, src: string, alt: string) => {
      setImages((prev) => {
        const next = [...prev];
        next[index] = { src, alt, isCustom: true };
        save(next);
        return next;
      });
    },
    [save]
  );

  /** Add images to the end */
  const addImages = useCallback(
    (newImgs: CustomImage[]) => {
      setImages((prev) => {
        const next = [...prev, ...newImgs];
        save(next);
        return next;
      });
    },
    [save]
  );

  /** Remove one slot */
  const removeImage = useCallback(
    (index: number) => {
      setImages((prev) => {
        const next = prev.filter((_, i) => i !== index);
        save(next);
        return next;
      });
    },
    [save]
  );

  /** Reset to defaults */
  const resetImages = useCallback(() => {
    save(defaultImages);
  }, [save, defaultImages]);

  return { images, loaded, replaceImage, addImages, removeImage, resetImages };
}

/** Reads a File as a base64 data URL */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
