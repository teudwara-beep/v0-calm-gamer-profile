"use client";

import { motion } from "framer-motion";

interface SocialIconProps {
  icon: string;
  className?: string;
}

export function SocialIcon({ icon, className = "" }: SocialIconProps) {
  const icons: Record<string, JSX.Element> = {
    discord: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.73 19.73 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.073.073 0 0 0 .079-.026c.462-.613.873-1.265 1.226-1.96.021-.037.001-.08-.038-.095a13.201 13.201 0 0 1-1.873-.892.074.074 0 0 1-.037-.092c.001-.025.02-.052.047-.063 1.291-.778 2.692-.1 3.928-.892.009-.005.025-.007.034 0a13.27 13.27 0 0 0 1.226 1.96.073.073 0 0 0 .079.026 19.82 19.82 0 0 0 5.993-3.03.072.072 0 0 0 .031-.057c.504-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-.967-2.157-2.156 0-1.193.966-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.19-.964 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.967-2.157-2.156 0-1.193.966-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.19-.964 2.156-2.157 2.156z"/>
      </svg>
    ),
    twitch: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
      </svg>
    ),
    steam: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.524 0 2.494-2.03 4.524-4.524 4.524h-.008v2.993c2.022 0 3.944.818 5.322 2.201 1.377-1.383 2.195-3.305 2.195-5.327 0-4.916-3.997-8.891-8.925-8.891zm4.524 7.811c-1.812 0-3.282-1.47-3.282-3.281s1.47-3.282 3.282-3.282c1.811 0 3.281 1.471 3.281 3.282s-1.47 3.281-3.281 3.281zm9.474 3.282c0 .633-.512 1.145-1.145 1.145-.633 0-1.146-.512-1.146-1.145s.513-1.146 1.146-1.146c.633 0 1.145.513 1.145 1.146z"/>
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  };

  return icons[icon] || null;
}

interface SocialLinksProps {
  socials: Array<{ name: string; url: string; icon: string }>;
}

export function SocialLinks({ socials }: SocialLinksProps) {
  return (
    <div className="flex items-center gap-4">
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.4 }}
          className="group relative p-2.5 rounded-lg bg-gradient-to-br from-card/70 to-card/50 backdrop-blur-lg border border-border/60 hover:border-lavender/60 hover:bg-gradient-to-br hover:from-card/90 hover:to-card/70 transition-all duration-500 ease-in-out hover:shadow-xl hover:shadow-lavender/20"
          aria-label={social.name}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <SocialIcon 
            icon={social.icon} 
            className="h-5 w-5 text-muted-foreground group-hover:text-lavender transition-colors duration-500 ease-in-out" 
          />
          
          {/* Hover tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-muted-foreground bg-card/95 rounded border border-border/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg">
            {social.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
}
