"use client";

import { motion } from "framer-motion";
import { ProfileCard } from "./profile-card";

interface MainProfileProps {
  onBack: () => void;
}

export function MainProfile({ onBack }: MainProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
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
      
      {/* Profile Card */}
      <ProfileCard />
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 text-center"
      >
        <p className="text-xs text-muted-foreground/50 tracking-wide">
          Made with calm vibes
        </p>
      </motion.footer>
    </motion.div>
  );
}
