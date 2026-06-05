// ============================================
// CONFIGURATION - Easy to customize
// ============================================

export const siteConfig = {
  // Video background - swap this path to change the background
  videoSrc: "/assets/calm-bg.mp4",
  
  // Discord ID for Lanyard API
  // Replace with your Discord User ID
  discordId: "1138828023748120656",
  
  // Profile information
  profile: {
    username: "Theekz",
    tagline: "Chill vibes & late night gaming sessions",
    // Discord avatar - will be fetched from Discord API in real-time via Lanyard
    avatar: `https://cdn.discordapp.com/avatars/1138828023748120656/a_placeholder.gif?size=128`,
    bio: "Just a cozy gamer who loves lofi beats, rainy nights, and immersive adventures. Currently exploring virtual worlds and collecting good memories.",
  },
  
  // Social links
  socials: [
    { name: "Discord", url: "https://discord.com", icon: "discord" },
    { name: "Twitch", url: "https://twitch.tv", icon: "twitch" },
    { name: "Steam", url: "https://store.steampowered.com", icon: "steam" },
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "YouTube", url: "https://youtube.com/@musicvibes-sr4ky?si=Cqw3GWgU1QhdsTOL", icon: "youtube" },
  ],
} as const;
