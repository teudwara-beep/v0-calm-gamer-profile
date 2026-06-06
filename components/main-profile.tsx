"use client";
import { motion } from "framer-motion";
import { ProfileCard } from "./profile-card";
import { ViewCounter } from "./view-counter";

interface MainProfileProps {
  onBack: () => void;
}

export function MainProfile({ onBack }: MainProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.995 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      {/* Breathing animation wrapper */}
      <motion.div
        animate={{ scale: [1, 1.003, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* Animated calm gradient background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            animate={{
              background: [
                "radial-gradient(ellipse at 20% 50%, oklch(0.25 0.08 280) 0%, oklch(0.10 0.03 260) 50%, oklch(0.08 0.02 240) 100%)",
                "radial-gradient(ellipse at 80% 30%, oklch(0.22 0.07 300) 0%, oklch(0.10 0.03 270) 50%, oklch(0.08 0.02 250) 100%)",
                "radial-gradient(ellipse at 50% 80%, oklch(0.20 0.06 260) 0%, oklch(0.10 0.03 280) 50%, oklch(0.08 0.02 260) 100%)",
                "radial-gradient(ellipse at 20% 50%, oklch(0.25 0.08 280) 0%, oklch(0.10 0.03 260) 50%, oklch(0.08 0.02 240) 100%)",
              ]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          />
          {/* Subtle noise/star layer with drift */}
          <motion.div
            animate={{ x: [0, -5, 0, 5, 0], y: [0, -3, 0, 3, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
              backgroundSize: "90px 90px",
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
            }}
          />
        </div>

        {/* Soft glow behind profile card */}
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[320px] h-[320px] rounded-full bg-gradient-to-br from-violet-300/5 to-blue-300/5 blur-3xl"
        />

        {/* Profile Card */}
        <ProfileCard />
      </motion.div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={onBack}
        className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors duration-300 group z-30"
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

      {/* Footer with slow pulse */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.3, 0.2] }}
        transition={{ delay: 1, duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 text-center"
      >
        <p className="text-xs text-white/20 tracking-widest">
          made with Theekshana
        </p>
      </motion.footer>
    </motion.div>
  );
}
