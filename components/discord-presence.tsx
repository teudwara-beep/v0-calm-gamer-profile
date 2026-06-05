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

interface ActivityInfo {
  text: string;
  subtext?: string;
  icon?: string;
  type: "game" | "spotify" | "streaming" | "status";
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
        console.error("Failed to fetch initial Discord presence:", error);
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

  // Extract game activity if present
  const getGameActivity = (): ActivityInfo | null => {
    if (!data) return null;

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

    // Also check for streaming (treat similarly to game)
    const streamActivity = data.activities.find((a) => a.type === ACTIVITY_TYPE.STREAMING);
    if (streamActivity) {
      return {
        text: `Streaming ${streamActivity.name}`,
        subtext: streamActivity.details,
        type: "streaming",
      };
    }

    return null;
  };

  // Extract Spotify activity if present
  const getSpotifyActivity = (): ActivityInfo | null => {
    if (!data?.spotify) return null;

    return {
      text: data.spotify.song,
      subtext: `by ${data.spotify.artist}`,
      icon: data.spotify.album_art_url,
      type: "spotify",
    };
  };

  // Fallback status when no game or spotify
  const getFallbackStatus = (): ActivityInfo => {
    if (!data) {
      return { text: "Offline", type: "status" };
    }

    // Check for custom status
    const customStatus = data.activities.find((a) => a.type === ACTIVITY_TYPE.CUSTOM);
    if (customStatus?.state) {
      return { text: customStatus.state, type: "status" };
    }

    // Peaceful default when online but not doing anything specific
    if (data.discord_status !== "offline") {
      return { text: "Just Chilling", type: "status" };
    }

    return { text: "Offline", type: "status" };
  };

  const gameActivity = getGameActivity();
  const spotifyActivity = getSpotifyActivity();
  const fallbackStatus = getFallbackStatus();
  const status = data?.discord_status || "offline";

  // Determine what to show
  const hasGame = !!gameActivity;
  const hasSpotify = !!spotifyActivity;
  const hasBoth = hasGame && hasSpotify;

  return (
    <div className="flex flex-col gap-2">
      {/* Game Activity Block */}
      <AnimatePresence mode="wait">
        {hasGame && gameActivity && (
          <motion.div
            key="game-activity"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Game icon */}
            {gameActivity.icon ? (
              <div className="relative flex-shrink-0">
                <img
                  src={gameActivity.icon}
                  alt={gameActivity.text}
                  className="h-10 w-10 rounded-lg object-cover shadow-md"
                  crossOrigin="anonymous"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusColors[status]} animate-breathe`}
                />
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} animate-breathe`}
                />
                <span
                  className={`absolute h-2.5 w-2.5 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
                  style={{ animationDuration: "3s" }}
                />
              </div>
            )}

            {/* Game text */}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm text-foreground/90 font-medium tracking-wide truncate">
                {gameActivity.text}
              </span>
              {gameActivity.subtext && (
                <span className="text-xs text-muted-foreground truncate">
                  {gameActivity.subtext}
                </span>
              )}
            </div>

            {/* WebSocket indicator (only show on first row) */}
            {wsConnected && !hasBoth && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500/50" title="Live" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotify Activity Row - smaller when both are active */}
      <AnimatePresence mode="wait">
        {hasSpotify && spotifyActivity && (
          <motion.div
            key="spotify-activity"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, delay: hasBoth ? 0.1 : 0 }}
            className={`flex items-center gap-2 ${hasBoth ? "pl-1 border-l-2 border-muted/30 ml-1" : "gap-3"}`}
          >
            {/* Album art */}
            {spotifyActivity.icon ? (
              <div className="relative flex-shrink-0">
                <img
                  src={spotifyActivity.icon}
                  alt={spotifyActivity.text}
                  className={`rounded-md object-cover shadow-sm ${hasBoth ? "h-7 w-7" : "h-10 w-10 rounded-lg shadow-md"}`}
                  crossOrigin="anonymous"
                />
                {!hasGame && (
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${statusColors[status]} animate-breathe`}
                  />
                )}
              </div>
            ) : (
              !hasGame && (
                <div className="relative flex items-center justify-center">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} animate-breathe`}
                  />
                  <span
                    className={`absolute h-2.5 w-2.5 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              )
            )}

            {/* Spotify text */}
            <div className="flex flex-col min-w-0 flex-1">
              {hasBoth && (
                <span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider">
                  Now Playing
                </span>
              )}
              <span className={`text-foreground/90 font-medium tracking-wide truncate ${hasBoth ? "text-xs" : "text-sm"}`}>
                {hasBoth ? spotifyActivity.text : `Listening to ${spotifyActivity.text}`}
              </span>
              {spotifyActivity.subtext && (
                <span className={`text-muted-foreground truncate ${hasBoth ? "text-[10px]" : "text-xs"}`}>
                  {spotifyActivity.subtext}
                </span>
              )}
            </div>

            {/* WebSocket indicator */}
            {wsConnected && !hasGame && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500/50" title="Live" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback status when no game or spotify */}
      <AnimatePresence mode="wait">
        {!hasGame && !hasSpotify && (
          <motion.div
            key="fallback-status"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="relative flex items-center justify-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${statusColors[status]} animate-breathe`}
              />
              <span
                className={`absolute h-2.5 w-2.5 rounded-full ${statusColors[status]} opacity-40 animate-ping`}
                style={{ animationDuration: "3s" }}
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm text-foreground/90 font-medium tracking-wide truncate">
                {loading ? (
                  <span className="animate-pulse text-muted-foreground">Loading...</span>
                ) : (
                  fallbackStatus.text
                )}
              </span>
            </div>

            {/* WebSocket indicator */}
            {wsConnected && (
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500/50" title="Live" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show WebSocket indicator at the bottom when both activities are shown */}
      {hasBoth && wsConnected && (
        <div className="flex justify-end">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50" title="Live" />
        </div>
      )}
    </div>
  );
}
