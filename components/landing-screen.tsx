"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useEffect, useState } from "react";

interface LandingScreenProps {
  onEnter: () => void;
}

export function LandingScreen({ onEnter }: LandingScreenProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30, scale: 1.02 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-20 flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* ========== CALM BACKGROUND (AURORA + FLOATING ORBS) ========== */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1A1B3A]" />
      
      {/* Animated Orbs - Calm Floating */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl"
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(calc(-50% + ${mousePosition.x * 0.02}px), calc(-50% + ${mousePosition.y * 0.02}px))`,
            transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.4, 1)'
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/8 blur-3xl"
          style={{
            top: '30%',
            left: '20%',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.01}px)`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.4, 1)'
          }}
        />
        <div 
          className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/6 blur-3xl"
          style={{
            bottom: '20%',
            right: '15%',
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.015}px)`,
            transition: 'transform 0.7s cubic-bezier(0.2, 0.8, 0.4, 1)'
          }}
        />
      </div>

      {/* Soft Noise Texture */}
      <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Subtle vignette */}
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-transparent via-transparent to-black/40" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center space-y-6 z-10"
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[10px] text-white/30 tracking-[0.5em] uppercase font-light"
        >
          welcome to
        </motion.p>

        {/* Name - Smoother Typography */}
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.6em", y: 10 }}
          animate={{ opacity: 1, letterSpacing: "0.15em", y: 0 }}
          transition={{ delay: 0.7, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl font-extralight text-white/95 tracking-[0.15em]"
          style={{ 
            textShadow: "0 0 50px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.4)",
            fontWeight: 300,
          }}
        >
          {siteConfig.profile.username}
        </motion.h1>

        {/* Divider - Smoother */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 1.2, ease: "easeOut" }}
          className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-white/35 text-xs sm:text-sm font-light tracking-[0.25em] max-w-xs mx-auto"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
        >
          {siteConfig.profile.tagline}
        </motion.p>

        {/* Enter Button - More Calm */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            // Smooth exit before calling onEnter
            setTimeout(onEnter, 400);
          }}
          className="relative mt-6 px-10 py-3 rounded-full border border-white/10 bg-white/3 backdrop-blur-sm text-white/50 text-[10px] font-light tracking-[0.35em] uppercase transition-all duration-700 hover:border-white/20 hover:text-white/80 hover:bg-white/6"
          style={{ 
            boxShadow: "0 0 20px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.03)",
            letterSpacing: "0.35em",
          }}
        >
          Enter Profile
        </motion.button>
      </motion.div>

      {/* Scroll Indicator - Calmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
        />
        <span className="text-[8px] text-white/20 tracking-[0.4em] uppercase font-light">scroll</span>
      </motion.div>
    </motion.div>
  );
}
