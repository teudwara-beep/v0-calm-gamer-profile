"use client";
import { motion, useIsPresent } from "framer-motion";
import type { RefObject } from "react";
import { ProfileCard } from "./profile-card";
import { ProfileConstellation } from "./profile-constellation";
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
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      <div className="absolute inset-x-0 top-16 bottom-20 overflow-y-auto overscroll-contain px-4 sm:bottom-24 sm:px-6 lg:bottom-28">
        <ProfileConstellation />
        <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 py-3">
          <ProfileCard />
          <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 text-xs leading-5 text-zinc-400">
            <p>by <span className="font-medium text-[#cbbfe3]">Theekshana</span></p>
            <ViewCounter />
          </footer>
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

      <div className="pointer-events-none absolute right-4 bottom-4 left-4 z-30 flex justify-end sm:right-6 sm:bottom-6 lg:right-10 lg:bottom-9">
        <MusicPlayer audioRef={audioRef} onVolumeChange={onVolumeChange} />
      </div>
    </motion.div>
  );
}
