"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { DiscordPresence } from "./discord-presence";
import { SocialLinks } from "./social-icons";
import { useLanyard } from "@/hooks/use-lanyard";
import { User } from "lucide-react";

const statusColors = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-muted-foreground",
} as const;

export function ProfileCard() {
  const { profile, socials } = siteConfig;
  const { avatarUrl, decorationUrl, status, loading } = useLanyard();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      {/* Frosted glass card with enhanced calm aesthetic */}
      <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-card/50 via-card/30 to-card/40 backdrop-blur-xl p-8 overflow-hidden shadow-2xl">
        {/* Subtle gradient overlay - deeper, more peaceful */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: "linear-gradient(135deg, oklch(0.75 0.08 280 / 15%) 0%, transparent 50%, oklch(0.65 0.06 310 / 8%) 100%)"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Avatar with Discord decoration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Soft glow ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-lavender/30 to-indigo-500/20 blur-md animate-soft-glow" />
            
            {/* Avatar container with decoration overlay */}
            <div className="relative h-28 w-28">
              {/* Main avatar image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full rounded-full overflow-hidden border-2 border-lavender/30 shadow-lg"
              >
                {loading ? (
                  // Loading state - subtle pulse
                  <div className="h-full w-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                ) : avatarUrl ? (
                  // Dynamic Discord avatar
                  <Image
                    src={avatarUrl}
                    alt={profile.username}
                    fill
                    className="object-cover"
                    priority
                    unoptimized // Required for external Discord CDN URLs
                  />
                ) : (
                  // Fallback - minimalist user icon
                  <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground/60" />
                  </div>
                )}
              </motion.div>
              
              {/* Avatar decoration overlay (Nitro effect) */}
              {decorationUrl && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute -inset-3 pointer-events-none"
                >
                  <Image
                    src={decorationUrl}
                    alt="Avatar decoration"
                    fill
                    className="object-contain"
                    unoptimized // Required for animated GIFs and external URLs
                  />
                </motion.div>
              )}
            </div>
            
            {/* Online status indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
              className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-card ${statusColors[status]} animate-breathe`}
            />
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
            className="w-full h-px bg-gradient-to-r from-transparent via-lavender/40 to-transparent"
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
      
      {/* Ambient glow beneath card - enhanced */}
      <div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-3xl opacity-40 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, oklch(0.75 0.08 280 / 60%) 0%, oklch(0.65 0.06 310 / 20%) 50%, transparent 100%)"
        }}
      />
    </motion.div>
  );
}
