// ============================================
// CONFIGURATION - Easy to customize
// ============================================

export const siteConfig = {
  // Video background - swap this path to change the background
  videoSrc: "/profile-bg.mp4",
  
  // Discord ID for Lanyard API
  // Replace with your Discord User ID
  discordId: "1138828023748120656",

  valorant: {
    name: "Theekz",
    tag: "4392",
    region: "ap",
    platform: "pc",
  },
  
  // Profile information
  profile: {
    username: "Theekz",
    tagline: "in my own world for a bit",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "nothing special here, just trying to clear my head after a long day with some decent music and good games",
  },
  
  // Social links
  socials: [
    { name: "Discord", url: "https://discord.com/users/1138828023748120656", icon: "discord" },
    { name: "GitHub", url: "https://github.com/teudwara-beep", icon: "github" },
    { name: "YouTube", url: "https://youtube.com/@musicvibes-sr4ky?si=Cqw3GWgU1QhdsTOL", icon: "youtube" },
  ],
} as const;
