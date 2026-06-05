"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { DiscordPresence } from "./discord-presence";
import { SocialLinks } from "./social-icons";

export function ProfileCard() {
  const { profile, socials } = siteConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Frosted glass card */}
      <div className="relative rounded-2xl border border-border/50 bg-card/40 backdrop-blur-md p-8 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(135deg, oklch(0.75 0.08 280 / 10%) 0%, transparent 50%, oklch(0.70 0.06 300 / 5%) 100%)"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Soft glow ring */}
            <div className="absolute -inset-2 rounded-full bg-lavender/20 blur-md animate-soft-glow" />
            
            {/* Avatar image */}
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-lavender/30 shadow-lg">
              <Image
                src={profile.avatar}
                alt={profile.username}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Online status indicator */}
            <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-card bg-emerald-400 animate-breathe" />
          </motion.div>
          
          {/* Username */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <h2 className="inline-flex items-center gap-1.5 text-2xl sm:text-3xl font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
              {profile.username}
              <svg 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/80"
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 14l-4-4 4-4" />
                <path d="M5 10h11a4 4 0 0 1 0 8h-1" />
              </svg>
            </h2>
            <p className="mt-1 text-xs text-muted-foreground tracking-widest uppercase">
              Gamer Profile
            </p>
          </motion.div>
          
          {/* Discord Presence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full flex justify-center"
          >
            <DiscordPresence />
          </motion.div>
          
          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"
          />
          
          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-muted-foreground text-center leading-relaxed font-light"
          >
            {profile.bio}
          </motion.p>
          
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-2"
          >
            <SocialLinks socials={[...socials]} />
          </motion.div>
        </div>
      </div>
      
      {/* Ambient glow beneath card */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-2xl opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.75 0.08 280 / 50%) 0%, transparent 70%)"
        }}
      />
    </motion.div>
  );
}
