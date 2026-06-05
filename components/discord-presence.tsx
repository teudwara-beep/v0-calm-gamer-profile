"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Array<{
    name: string;
    state?: string;
    details?: string;
    type: number;
  }>;
  spotify?: {
    song: string;
    artist: string;
  };
}

const statusColors = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-muted-foreground",
} as const;

export function DiscordPresence() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${siteConfig.discordId}`
        );
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.log("[v0] Failed to fetch Discord presence:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPresence();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPresence, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityText = () => {
    if (!data) return "Offline";
    
    // Check for Spotify first
    if (data.spotify) {
      return `Listening to ${data.spotify.song}`;
    }
    
    // Check for gaming activity (type 0)
    const gameActivity = data.activities.find((a) => a.type === 0);
    if (gameActivity) {
      return `Playing ${gameActivity.name}`;
    }
    
    // Check for custom status (type 4)
    const customStatus = data.activities.find((a) => a.type === 4);
    if (customStatus?.state) {
      return customStatus.state;
    }
    
    // Fallback based on status
    const statusText = {
      online: "Online",
      idle: "Away",
      dnd: "Do Not Disturb",
      offline: "Offline",
    };
    return statusText[data.discord_status] || "Chilling";
  };

  const status = data?.discord_status || "offline";

  return (
    <div className="flex items-center gap-3">
      {/* Breathing status dot */}
      <div className="relative flex items-center justify-center">
        <span
          className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} animate-breathe`}
        />
        <span
          className={`absolute h-2.5 w-2.5 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
          style={{ animationDuration: "3s" }}
        />
      </div>
      
      {/* Status text */}
      <span className="text-sm text-muted-foreground font-light tracking-wide">
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : (
          getActivityText()
        )}
      </span>
    </div>
  );
}
