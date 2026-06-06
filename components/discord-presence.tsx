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

  return (
    <div className="flex flex-col space-y-3">
      {/* Game Activity Card */}
      <AnimatePresence mode="wait">
        {hasGame && gameActivity && (
          <motion.div
            key="game-activity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg p-3 border border-border/50 transition-all duration-500 ease-in-out hover:border-lavender/40 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/8"
          >
            <div className="flex items-center gap-3">
              {/* Game icon with status badge */}
              {gameActivity.icon ? (
                <div className="relative flex-shrink-0">
                  <img
                    src={gameActivity.icon}
                    alt={gameActivity.text}
                    className="h-11 w-11 rounded-lg object-cover shadow-md"
                    crossOrigin="anonymous"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]} animate-calm-pulse`}
                  />
                </div>
              ) : (
                <div className="relative flex-shrink-0 h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .36.129.703.35.992m5.25 7.5H2.25M6 20.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                  </svg>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]} animate-calm-pulse`}
                  />
                </div>
              )}

              {/* Game text */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm text-foreground font-medium tracking-wide truncate">
                  {gameActivity.text}
                </span>
                {gameActivity.subtext && (
                  <span className="text-xs text-muted-foreground truncate">
                    {gameActivity.subtext}
                  </span>
                )}
              </div>

              {/* WebSocket indicator */}
              {wsConnected && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 flex-shrink-0" title="Live" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spotify Activity Card */}
      <AnimatePresence mode="wait">
        {hasSpotify && spotifyActivity && (
          <motion.div
            key="spotify-activity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: hasGame ? 0.08 : 0 }}
            className="relative rounded-lg bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-lg p-3 border border-border/50 transition-all duration-500 ease-in-out hover:border-lavender/40 hover:bg-gradient-to-r hover:from-black/60 hover:to-black/40"
          >
            <div className="flex items-center gap-3">
              {/* Album art with status badge (only if no game) */}
              {spotifyActivity.icon ? (
                <div className="relative flex-shrink-0">
                  <img
                    src={spotifyActivity.icon}
                    alt={spotifyActivity.text}
                    className="h-11 w-11 rounded-lg object-cover shadow-md"
                    crossOrigin="anonymous"
                  />
                  {!hasGame && (
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]} animate-calm-pulse`}
                    />
                  )}
                </div>
              ) : (
                <div className="relative flex-shrink-0 h-11 w-11 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  {!hasGame && (
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]} animate-calm-pulse`}
                    />
                  )}
                </div>
              )}

              {/* Spotify text */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                  Now Listening
                </span>
                <span className="text-sm text-foreground font-medium tracking-wide truncate">
                  {spotifyActivity.text}
                </span>
                {spotifyActivity.subtext && (
                  <span className="text-xs text-muted-foreground truncate">
                    {spotifyActivity.subtext}
                  </span>
                )}
              </div>
{/* Music visualizer bars */}
              <div className="flex gap-1 items-end justify-center mt-2">
                {[0, 0.15, 0.3, 0.45, 0.6].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-400/50 rounded-full"
                    style={{
                      height: '4px',
                      animation: `softPulse 2s ease-in-out ${delay}s infinite`
                    }}
                  />
                ))}
              </div>
              <style>{`
                @keyframes softPulse {
                  0%, 100% { height: 4px; }
                  50% { height: 14px; }
                }
              `}</style>
              {/* WebSocket indicator (only if no game) */}
              {wsConnected && !hasGame && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 flex-shrink-0" title="Live" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback status when no game or spotify */}
      <AnimatePresence mode="wait">
        {!hasGame && !hasSpotify && (
          <motion.div
            key="fallback-status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg p-3 border border-border/50 transition-all duration-500 ease-in-out hover:border-lavender/40 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/8"
          >
            <div className="flex items-center gap-3">
              {/* Status dot */}
              <div className="relative flex-shrink-0 h-11 w-11 rounded-lg bg-white/5 flex items-center justify-center">
                <div className="relative">
                  <span
                    className={`h-3 w-3 rounded-full ${statusColors[status]} animate-calm-pulse block`}
                  />
                  <span
                    className={`absolute inset-0 h-3 w-3 rounded-full ${statusColors[status]} opacity-25 animate-ping`}
                    style={{ animationDuration: "2.5s" }}
                  />
                </div>
              </div>

              {/* Status text */}
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm text-foreground font-medium tracking-wide truncate">
                  {loading ? (
                    <span className="animate-pulse text-muted-foreground">Loading...</span>
                  ) : (
                    fallbackStatus.text
                  )}
                </span>
              </div>

              {/* WebSocket indicator */}
              {wsConnected && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/60 flex-shrink-0" title="Live" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export function useDiscordStatus() {
  const [status, setStatus] = useState<"online"|"idle"|"dnd"|"offline">("offline");

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.op === 1) {
          heartbeatInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }));
            }
          }, message.d.heartbeat_interval);
          ws?.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: siteConfig.discordId },
          }));
        }
        if (message.op === 0 && (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE")) {
          setStatus(message.d.discord_status);
        }
      };

      ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws?.close();
    };

    connect();

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) ws.close();
    };
  }, []);

  return status;
}
