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
    tagline: "in my own world for a bit",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "nothing special here, just trying to clear my head after a long day with some decent music and good games",
  },
  
  // Social links
  socials: [
    { name: "Discord", url: "discord.com/users/1138828023748120656", icon: "discord" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { name: "Twitch", url: "https://twitch.tv", icon: "twitch" },
    { name: "Steam", url: "https://store.steampowered.com", icon: "steam" },
    { name: "GitHub", url: "https://github.com", icon: "github" },
  ],
} as const;
