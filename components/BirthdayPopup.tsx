"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomImages } from "@/hooks/useCustomImages";

export default function BirthdayPopup({ onClose }: { onClose: () => void }) {
  const storageKey = "birthday_popup_image";
  const defaultImages = [];
  const { images, loaded, addImages, replaceImage, removeImage } = useCustomImages(
    storageKey,
    defaultImages
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataURL = await readFileAsDataURL(file);
    if (images.length > 0) replaceImage(0, dataURL, file.name);
    else addImages([{ src: dataURL, alt: file.name, isCustom: true }]);
  };

  const handleRemove = () => {
    if (images.length > 0) removeImage(0);
  };

  const sparkles = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: [1, 1.4, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative p-8 bg-gradient-to-br from-pink-200 to-purple-200 rounded-xl shadow-2xl max-w-md text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            variants={sparkles}
            initial="hidden"
            animate="visible"
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="80" stroke="gold" strokeWidth="4" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-4 text-pink-800">
            Happy Birthday, My Love! 🎉
          </h2>
          <p className="mb-4 text-pink-700">
            Wishing you a day filled with love, joy, and beautiful moments.
          </p>
          {images.length > 0 && (
            <motion.img
              src={images[0].src}
              alt={images[0].alt}
              className="mx-auto mb-4 rounded shadow-md w-48 h-48 object-cover cursor-pointer"
              whileHover={{ scale: 1.05 }}
            />
          )}
          <div className="flex flex-col space-y-2">
            <label className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-white py-1 px-3 rounded">
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
            {images.length > 0 && (
              <button
                className="bg-red-400 hover:bg-red-500 text-white py-1 px-3 rounded"
                onClick={handleRemove}
              >
                Remove Image
              </button>
            )}
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
