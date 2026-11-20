"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { DiscordPresence } from "./discord-presence";
import { DiscordDisplayName } from "./discord-display-name";
import { SocialLinks } from "./social-icons";
import { useLanyard } from "@/hooks/use-lanyard";
import { User } from "lucide-react";
import styles from "./profile-card.module.css";

const statusColors = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-muted-foreground",
} as const;

export function ProfileCard() {
  const { profile, socials } = siteConfig;
  const { data, avatarUrl, decorationUrl, status, loading } = useLanyard();
  const discordUser = data?.discord_user;
  const displayName = discordUser?.global_name?.trim() || discordUser?.username || profile.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className={`relative w-full max-w-md mx-auto ${styles.perspective}`}
    >
      <div className={`relative border border-transparent p-5 sm:p-8 ${styles.card}`}>
        <div aria-hidden="true" className={styles.backPlate} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-1px] overflow-hidden rounded-[32px] border border-[#c6b7f4]/18 bg-[#141726]/80 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.75),0_0_28px_-14px_rgba(181,159,244,0.28)] backdrop-blur-2xl"
        >
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-10 motion-reduce:hidden">
            <source src="/card-bg.mp4" type="video/mp4" />
          </video>
          <div className={styles.glassTint} />
          <div className={styles.reflection} />
        </div>

        {/* Content */}
        <div className={`relative flex flex-col items-center gap-4 sm:gap-5 ${styles.content}`}>
          {/* Avatar with Discord decoration */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className={`relative ${styles.avatar}`}
          >
            <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-lavender/20 to-indigo-500/12 blur-md animate-soft-glow" />
            
            <div className="relative h-28 w-28">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative h-full w-full rounded-full overflow-hidden border-2 border-lavender/30 shadow-lg"
              >
                {loading ? (
                  <div className="h-full w-full bg-muted/30 animate-pulse flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground/50" />
                  </div>
                ) : avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full bg-muted/20 flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground/60" />
                  </div>
                )}
              </motion.div>
              
              {decorationUrl && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute -inset-3 pointer-events-none"
                >
                  <img
                    src={decorationUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ mixBlendMode: 'normal' }}
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[#191c2c] ${statusColors[status]}`}
            />
          </motion.div>
          
          {/* Display name */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-full text-center"
          >
            <DiscordDisplayName name={displayName} appearance={discordUser?.display_name_styles} />
            <p className="mt-1 text-[10px] tracking-[0.18em] text-zinc-300/80 uppercase">
              Gamer Profile
            </p>
          </motion.div>
          
          {/* Discord and VALORANT activity */}
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
            className="w-full h-px bg-gradient-to-r from-transparent via-lavender/30 to-transparent"
          />
          
          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="max-w-[34ch] text-center text-sm leading-relaxed text-pretty text-zinc-300"
          >
            {profile.bio}
          </motion.p>
          
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="pt-2"
          >
            <SocialLinks socials={[...socials]} />
          </motion.div>
        </div>
      </div>
      
    </motion.div>
  );
}
