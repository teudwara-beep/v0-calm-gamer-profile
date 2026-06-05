"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { VideoBackground } from "@/components/video-background";
import { LandingScreen } from "@/components/landing-screen";
import { MainProfile } from "@/components/main-profile";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "profile">("landing");

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Video Background - always visible */}
      <VideoBackground />
      
      {/* Page Content with smooth transitions */}
      <AnimatePresence mode="wait">
        {currentPage === "landing" ? (
          <LandingScreen 
            key="landing"
            onEnter={() => setCurrentPage("profile")} 
          />
        ) : (
          <MainProfile 
            key="profile"
            onBack={() => setCurrentPage("landing")} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
