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

const ACTIVITY_TYPE = {
  GAME: 0,
  STREAMING: 1,
  LISTENING: 2,
  WATCHING: 3,
  CUSTOM: 4,
  COMPETING: 5,
} as const;

function getAssetUrl(applicationId: string, assetId: string): string {
  if (assetId.startsWith("mp:external/")) {
    const path = assetId.replace("mp:external/", "");
    return `https://media.discordapp.net/external/${path}`;
  }
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

      ws.onopen = () => setWsConnected(true);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        switch (message.op) {
          case 1:
            heartbeatInterval = setInterval(() => {
              if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, message.d.heartbeat_interval);

            ws?.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: siteConfig.discordId },
              })
            );
            break;

          case 0:
            if (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE") {
              handlePresenceUpdate(message.d);
            }
            break;
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = () => ws?.close();
    };

    const fetchInitial = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${siteConfig.discordId}`
        );
        const json = await res.json();
        if (json.success) handlePresenceUpdate(json.data);
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

  const getSpotifyActivity = (): ActivityInfo | null => {
    if (!data?.spotify) return null;
    return {
      text: data.spotify.song,
      subtext: `by ${data.spotify.artist}`,
      icon: data.spotify.album_art_url,
      type: "spotify",
    };
  };

  const getFallbackStatus = (): ActivityInfo => {
    if (!data) return { text: "Offline", type: "status" };

    const customStatus = data.activities.find((a) => a.type === ACTIVITY_TYPE.CUSTOM);
    if (customStatus?.state) {
      return { text: customStatus.state, type: "status" };
    }

    if (data.discord_status !== "offline") {
      return { text: "Just Chilling", type: "status" };
    }

    return { text: "Offline", type: "status" };
  };

  const gameActivity = getGameActivity();
  const spotifyActivity = getSpotifyActivity();
  const fallbackStatus = getFallbackStatus();
  const status = data?.discord_status || "offline";

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
            transition={{ duration: 0.3 }}
            className="relative rounded-lg bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg p-3 border border-border/50 hover:border-purple-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {gameActivity.icon ? (
                  <img
                    src={gameActivity.icon}
                    alt={gameActivity.text}
                    className="h-11 w-11 rounded-lg object-cover shadow-md"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-xl">🎮</span>
                  </div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]}`} />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm text-foreground font-medium truncate">{gameActivity.text}</span>
                {gameActivity.subtext && (
                  <span className="text-xs text-muted-foreground truncate">{gameActivity.subtext}</span>
                )}
              </div>

              {wsConnected && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />}
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
            transition={{ duration: 0.3 }}
            className="relative rounded-lg bg-gradient-to-r from-emerald-950/30 to-black/40 backdrop-blur-lg p-3 border border-emerald-500/20 hover:border-emerald-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                {spotifyActivity.icon ? (
                  <img
                    src={spotifyActivity.icon}
                    alt={spotifyActivity.text}
                    className="h-11 w-11 rounded-lg object-cover shadow-md"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-xl">🎵</span>
                  </div>
                )}
                {!hasGame && (
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${statusColors[status]}`} />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Now Listening</span>
                <span className="text-sm text-foreground font-medium truncate">{spotifyActivity.text}</span>
                {spotifyActivity.subtext && (
                  <span className="text-xs text-muted-foreground truncate">{spotifyActivity.subtext}</span>
                )}
              </div>

              {/* Music Equalizer Visualizer */}
              <div className="flex items-end gap-0.5 h-4 px-1">
                {[0, 0.2, 0.4, 0.1, 0.3].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s`, animationDuration: '1s' }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fallback Status */}
      <AnimatePresence mode="wait">
        {!hasGame && !hasSpotify && (
          <motion.div
            key="fallback-status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-lg bg-white/5 backdrop-blur-lg p-3 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 h-11 w-11 rounded-lg bg-white/5 flex items-center justify-center">
                <span className={`h-3 w-3 rounded-full ${statusColors[status]} animate-pulse`} />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-sm text-foreground font-medium truncate">
                  {loading ? "Loading..." : fallbackStatus.text}
                </span>
              </div>

              {wsConnected && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="Live" />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Custom Hook to get status anywhere else in your project
export function useDiscordStatus() {
  const [status, setStatus] = useState<"online" | "idle" | "dnd" | "offline">("offline");

  useEffect(() => {
    let ws: WebSocket | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;

    const connect = () => {
      ws = new WebSocket("wss://api.lanyard.rest/socket");

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.op === 1) {
          heartbeatInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
          }, message.d.heartbeat_interval);

          ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: siteConfig.discordId } }));
        }
        if (message.op === 0 && (message.t === "INIT_STATE" || message.t === "PRESENCE_UPDATE")) {
          setStatus(message.d.discord_status);
        }
      };

      ws.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval);
        setTimeout(connect, 5000);
      };
    };

    connect();
    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (ws) ws.close();
    };
  }, []);

  return status;
}
