"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import { LandingScreen } from "@/components/landing-screen";
import { MainProfile } from "@/components/main-profile";

const musicVolume = 0.3;
const fadeStartVolume = 0.04;
const fadeDuration = 2000;

function fadeIn(audio: HTMLAudioElement, signal: AbortSignal) {
  if (signal.aborted) return;

  const started = performance.now();
  let frame = requestAnimationFrame(function step(now) {
    const progress = Math.min(1, (now - started) / fadeDuration);
    audio.volume = audio.paused ? musicVolume : fadeStartVolume + (musicVolume - fadeStartVolume) * progress;
    if (!audio.paused && progress < 1) frame = requestAnimationFrame(step);
  });
  signal.addEventListener("abort", () => cancelAnimationFrame(frame), { once: true });
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "profile">("landing");
  const audioRef = useRef<HTMLAudioElement>(null);
  const fade = useRef<AbortController | null>(null);

  useEffect(() => () => fade.current?.abort(), []);

  const enterProfile = useCallback(() => {
    // Start playback within the original gesture, before the profile transition.
    const audio = audioRef.current;
    if (audio) {
      fade.current?.abort();
      const controller = new AbortController();
      fade.current = controller;
      audio.volume = fadeStartVolume;
      void audio.play().then(() => fadeIn(audio, controller.signal)).catch(() => {
        if (!controller.signal.aborted) audio.volume = musicVolume;
      });
    }
    setCurrentPage("profile");
  }, []);

  const leaveProfile = () => {
    fade.current?.abort();
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentPage("landing");
  };

  const changeVolume = (volume: number) => {
    fade.current?.abort();
    if (audioRef.current) audioRef.current.volume = volume;
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <audio ref={audioRef} src="/bg-music.mp3" preload="none" loop />
      {/* Video Background - always visible */}
      <VideoBackground />
      
      {/* Page Content with smooth transitions */}
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {currentPage === "landing" ? (
            <LandingScreen key="landing" onEnter={enterProfile} />
          ) : (
            <MainProfile key="profile" onBack={leaveProfile} audioRef={audioRef} onVolumeChange={changeVolume} />
          )}
        </AnimatePresence>
      </MotionConfig>
    </main>
  );
}
