"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import { LandingScreen } from "@/components/landing-screen";
import { MainProfile } from "@/components/main-profile";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "profile">("landing");
  const audioRef = useRef<HTMLAudioElement>(null);

  const enterProfile = useCallback(() => {
    // Start playback within the original gesture, before the profile transition.
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.3;
      void audio.play().catch(() => {
        // Browsers that block autoplay can still use the profile's Play button.
      });
    }
    setCurrentPage("profile");
  }, []);

  const leaveProfile = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCurrentPage("landing");
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <audio ref={audioRef} src="/bg-music.mp3" preload="none" loop />
      {/* Video Background - always visible */}
      <VideoBackground />
      
      {/* Page Content with smooth transitions */}
      <AnimatePresence mode="wait">
        {currentPage === "landing" ? (
          <LandingScreen 
            key="landing"
            onEnter={enterProfile}
          />
        ) : (
          <MainProfile 
            key="profile"
            onBack={leaveProfile}
            audioRef={audioRef}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
