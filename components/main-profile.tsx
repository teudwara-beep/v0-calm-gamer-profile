"use client";
import { motion, useIsPresent } from "framer-motion";
import type { RefObject } from "react";
import { ProfileCard } from "./profile-card";
import { MusicPlayer } from "./music-player";
import { ViewCounter } from "./view-counter";

interface MainProfileProps {
  onBack: () => void;
  audioRef: RefObject<HTMLAudioElement | null>;
  onVolumeChange: (volume: number) => void;
}

export function MainProfile({ onBack, audioRef, onVolumeChange }: MainProfileProps) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      inert={!isPresent}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[#0c101b]"
        style={{
          backgroundImage: "radial-gradient(ellipse at 18% 18%, rgba(105,78,147,0.22), transparent 62%), radial-gradient(ellipse at 90% 80%, rgba(53,79,110,0.18), transparent 60%)",
        }}
      />

      <div className="absolute inset-x-0 top-16 bottom-20 overflow-y-auto overscroll-contain px-4 sm:px-6">
        <div className="flex min-h-full items-center py-3">
          <ProfileCard />
        </div>
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/65 hover:text-white/90 transition-colors duration-300 group z-30"
      >
        <svg
          className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span className="text-sm font-light tracking-wide">Back</span>
      </motion.button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-3 px-4 pb-4 sm:justify-end sm:px-6 sm:pb-6">
        <footer className="min-w-0 rounded-2xl bg-black/20 px-3 py-2 backdrop-blur-sm sm:absolute sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:text-center">
          <p className="text-xs leading-4 tracking-wide text-zinc-300/80">
            by <span className="font-medium text-[#d2c3f3]">Theekshana</span>
          </p>
          <ViewCounter />
        </footer>
        <MusicPlayer audioRef={audioRef} onVolumeChange={onVolumeChange} />
      </div>
    </motion.div>
  );
}
