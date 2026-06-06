"use client";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

interface LandingScreenProps {
  onEnter: () => void;
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      {/* Main content container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className="text-center space-y-8"
      >
        {/* Small label above name */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xs text-white/40 tracking-[0.4em] uppercase"
        >
          welcome to
        </motion.p>

        {/* Username / Title */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.6em", y: 10 }}
          animate={{ opacity: 1, letterSpacing: "0.25em", y: 0 }}
          transition={{ delay: 0.7, duration: 1.4, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-light text-white/90 tracking-widest drop-shadow-lg"
        >
          {siteConfig.profile.username}
        </motion.h1>

        {/* Subtle divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/50 text-sm sm:text-base font-light tracking-widest max-w-md mx-auto"
        >
          {siteConfig.profile.tagline}
        </motion.p>

        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.12)" }}
          whileTap={{ scale: 0.97 }}
          onClick={onEnter}
          className="group relative mt-4 px-10 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/70 text-xs font-light tracking-[0.3em] uppercase transition-all duration-500 hover:border-white/40 hover:text-white"
        >
          <span className="relative z-10">Enter Profile</span>
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)"
            }}
          />
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
        />
        <span className="text-[10px] text-white/30 tracking-[0.3em] uppercase">scroll</span>
      </motion.div>
    </motion.div>
  );
}
