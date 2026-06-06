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
      exit={{ opacity: 0, y: -30, scale: 1.02 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      {/* Soft dark overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[3px]" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        className="relative text-center space-y-6"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[10px] text-white/35 tracking-[0.5em] uppercase"
        >
          welcome to
        </motion.p>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.6em", y: 10 }}
          animate={{ opacity: 1, letterSpacing: "0.2em", y: 0 }}
          transition={{ delay: 0.7, duration: 1.4, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-extralight text-white/95 tracking-widest"
          style={{ textShadow: "0 0 40px rgba(255,255,255,0.15), 0 2px 20px rgba(0,0,0,0.5)" }}
        >
          {siteConfig.profile.username}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2 }}
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-white/40 text-xs sm:text-sm font-light tracking-[0.25em] max-w-xs mx-auto"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.8)" }}
        >
          {siteConfig.profile.tagline}
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setTimeout(onEnter, 400); }}
          className="relative mt-6 px-10 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-white/60 text-[10px] font-light tracking-[0.35em] uppercase transition-all duration-500 hover:border-white/30 hover:text-white/90 hover:bg-white/8"
          style={{ boxShadow: "0 0 30px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          Enter Profile
        </motion.button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
        <span className="text-[9px] text-white/25 tracking-[0.4em] uppercase">scroll</span>
      </motion.div>
    </motion.div>
  );
}
