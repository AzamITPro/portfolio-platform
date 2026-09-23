"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectMediaItem } from "@/types";
import { Images, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProjectGalleryProps {
  mediaItems: ProjectMediaItem[];
}

export function ProjectGallery({ mediaItems }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : mediaItems.length - 1));
  }, [selectedIndex, mediaItems.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev !== null && prev < mediaItems.length - 1 ? prev + 1 : 0));
  }, [selectedIndex, mediaItems.length]);

  // Keyboard navigation: Escape to close, Arrows to navigate
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev]);

  if (!mediaItems || mediaItems.length === 0) return null;

  const currentMedia = selectedIndex !== null ? mediaItems[selectedIndex] : null;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-800/80">
      {/* Section Header */}
      <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
        <Images className="w-4 h-4 text-emerald-400" />
        <span>Project Screenshots Gallery ({mediaItems.length} images - click to expand)</span>
      </h2>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.caption || `Screenshot ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Hover Overlay with Expand Icon */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-blue-600/80 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 text-[11px] text-zinc-300 truncate">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentMedia && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Top Bar (Counter & Close) */}
          <div
            className="flex items-center justify-between w-full max-w-6xl mx-auto text-zinc-400 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-mono font-semibold bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800 text-zinc-300">
              {selectedIndex + 1} / {mediaItems.length}
            </span>

            <button
              onClick={() => setSelectedIndex(null)}
              className="p-2 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Active Large Image + Next/Prev Controls */}
          <div
            className="relative flex items-center justify-center flex-1 max-w-6xl w-full mx-auto my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {mediaItems.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Image */}
            <div className="relative max-h-[80vh] max-w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentMedia.url}
                alt={currentMedia.caption || "Expanded Screenshot"}
                className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain border border-zinc-800/80 shadow-2xl shadow-black"
              />
            </div>

            {/* Next Button */}
            {mediaItems.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Bar: Caption */}
          <div
            className="w-full max-w-2xl mx-auto text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia.caption && (
              <p className="text-xs text-zinc-300 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800 inline-block shadow-lg">
                {currentMedia.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}