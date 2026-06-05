"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/lib/config";

interface Activity {
  name: string;
  state?: string;
  details?: string;
  type: number;
  application_id?: string;
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Activity[];
  spotify?: {
    song: string;
    artist: string;
    album_art_url?: string;
  };
}

const statusColors = {
  online: "bg-emerald-400",
  idle: "bg-amber-400",
  dnd: "bg-rose-400",
  offline: "bg-muted-foreground",
} as const;

// Activity types from Discord API
const ACTIVITY_TYPE = {
  GAME: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
  COMPETING: 5,
} as const;

function getAssetUrl(applicationId: string, assetId: string): string {
  // Handle external assets (mp:external/...)
  if (assetId.startsWith("mp:external/")) {
    const path = assetId.replace("mp:external/", "");
    return `https://media.discordapp.net/external/${path}`;
  }
  // Standard Discord application assets
  return `https://cdn.discordapp.com/app-assets/${applicationId}/${assetId}.png`;
}

export function DiscordPresence() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  const handlePresenceUpdate = useCallback((newData: LanyardData) => {
    setData(newData);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onopen = () => {
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.op) {
          case 1: // Hello - send init
            // Start heartbeat
            heartbeatInterval = setInterval(() => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, message.d.heartbeat_interval);

            // Subscribe to user
            ws?.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: siteConfig.discordId },
              })
            );
            break;

          case 0: // Event
            if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
              handlePresenceUpdate(message.d);
            }
            break;
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        // Attempt reconnect after 5 seconds
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    // Initial fetch for immediate data while WebSocket connects
    const fetchInitial = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${siteConfig.discordId}`
        );
        const json = await res.json();
        if (json.success) {
          handlePresenceUpdate(json.data);
        }
      } catch (error) {
        console.log("[v0] Failed to fetch initial Discord presence:", error);
      }
    };

    fetchInitial();
    connect();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, [handlePresenceUpdate]);

  // Priority: Game > Streaming > Spotify > Custom Status > Default
  const getActivity = (): {
    text: string;
    subtext?: string;
    icon?: string;
    type: "game" | "spotify" | "streaming" | "status";
  } => {
    if (!data) {
      return { text: "Offline", type: "status" };
    }

    // 1. Check for gaming activity (highest priority)
    const gameActivity = data.activities.find((a) => a.type === ACTIVITY_TYPE.GAME);
    if (gameActivity) {
      let icon: string | undefined;
      if (gameActivity.application_id && gameActivity.assets?.large_image) {
        icon = getAssetUrl(gameActivity.application_id, gameActivity.assets.large_image);
      }
      return {
        text: `Playing ${gameActivity.name}`,
        subtext: gameActivity.details || gameActivity.state,
        icon,
        type: "game",
      };
    }

    // 2. Check for streaming
    const streamActivity = data.activities.find((a) => a.type === ACTIVITY_TYPE.STREAMING);
    if (streamActivity) {
      return {
        text: `Streaming ${streamActivity.name}`,
        subtext: streamActivity.details,
        type: "streaming",
      };
    }

    // 3. Check for Spotify
    if (data.spotify) {
      return {
        text: `Listening to ${data.spotify.song}`,
        subtext: `by ${data.spotify.artist}`,
        icon: data.spotify.album_art_url,
        type: "spotify",
      };
    }

    // 4. Check for custom status
    const customStatus = data.activities.find((a) => a.type === ACTIVITY_TYPE.CUSTOM);
    if (customStatus?.state) {
      return { text: customStatus.state, type: "status" };
    }

    // 5. Fallback - peaceful default when online but not doing anything specific
    if (data.discord_status !== "offline") {
      return { text: "Just Chilling", type: "status" };
    }

    return { text: "Offline", type: "status" };
  };

  const activity = getActivity();
  const status = data?.discord_status || "offline";

  return (
    <div className="flex items-center gap-3">
      {/* Activity icon (game/album art) */}
      <AnimatePresence mode="wait">
        {activity.icon ? (
          <motion.div
            key={activity.icon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative flex-shrink-0"
          >
            <img
              src={activity.icon}
              alt={activity.text}
              className="h-10 w-10 rounded-lg object-cover shadow-md"
              crossOrigin="anonymous"
            />
            {/* Status dot overlay */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusColors[status]} animate-breathe`}
            />
          </motion.div>
        ) : (
          <motion.div
            key="status-dot"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} animate-breathe`}
            />
            <span
              className={`absolute h-2.5 w-2.5 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
              style={{ animationDuration: "3s" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status text */}
      <div className="flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={activity.text}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-foreground/90 font-medium tracking-wide truncate"
          >
            {loading ? (
              <span className="animate-pulse text-muted-foreground">Loading...</span>
            ) : (
              activity.text
            )}
          </motion.span>
        </AnimatePresence>
        {activity.subtext && !loading && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground truncate"
          >
            {activity.subtext}
          </motion.span>
        )}
      </div>

      {/* WebSocket connection indicator (subtle) */}
      {wsConnected && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500/50" title="Live" />
      )}
    </div>
  );
}
