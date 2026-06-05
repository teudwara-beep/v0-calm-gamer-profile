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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6"
    >
      {/* Main content container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center space-y-8"
      >
        {/* Username / Title */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.2em" }}
          transition={{ delay: 0.5, duration: 1.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground tracking-widest"
        >
          {siteConfig.profile.username}
        </motion.h1>
        
        {/* Subtle divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-lavender/50 to-transparent"
        />
        
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-muted-foreground text-sm sm:text-base font-light tracking-wide max-w-md mx-auto"
        >
          {siteConfig.profile.tagline}
        </motion.p>
        
        {/* Enter button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="group relative mt-8 px-8 py-3 rounded-full border border-lavender/30 bg-card/30 backdrop-blur-sm text-foreground/80 text-sm font-light tracking-widest uppercase transition-all duration-500 hover:border-lavender/60 hover:bg-card/50 hover:text-foreground"
        >
          <span className="relative z-10">Enter Profile</span>
          
          {/* Soft glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "radial-gradient(ellipse at center, oklch(0.75 0.08 280 / 15%) 0%, transparent 70%)"
            }}
          />
        </motion.button>
      </motion.div>
      
      {/* Floating ambient elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2, duration: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-lavender/50 to-transparent"
        />
        <span className="text-xs text-muted-foreground/50 tracking-widest uppercase">
          Scroll
        </span>
      </motion.div>
    </motion.div>
  );
}
