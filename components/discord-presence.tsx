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
  online: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
  idle: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
  dnd: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
  offline: "bg-zinc-500",
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
  if (assetId.startsWith("http://") || assetId.startsWith("https://")) {
    return assetId;
  }
  if (assetId.startsWith("mp:external/")) {
    const path = assetId.replace(/^mp:external\//, "");
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
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
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
    <div className="flex flex-col space-y-3 w-full max-w-xs mx-auto">
      {/* Game Activity Card */}
      <AnimatePresence mode="wait">
        {hasGame && gameActivity && (
          <motion.div
            key="game-activity"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 backdrop-blur-xl p-3.5 border border-purple-500/20 hover:border-purple-500/40 transition-all shadow-lg shadow-purple-900/10"
          >
            {/* Subtle Neon Background Glow */}
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-purple-500/10 blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-all" />

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="relative flex-shrink-0">
                {gameActivity.icon ? (
                  <img
                    src={gameActivity.icon}
                    alt={gameActivity.text}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10 shadow-md"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20 flex items-center justify-center">
                    <span className="text-xl">🎮</span>
                  </div>
                )}
                <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 ${statusColors[status]}`} />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">Gaming</span>
                <span className="text-xs font-semibold text-zinc-100 truncate">{gameActivity.text}</span>
                {gameActivity.subtext && (
                  <span className="text-[11px] text-zinc-400 truncate">{gameActivity.subtext}</span>
                )}
              </div>

              {wsConnected && (
                <span className="h-2 w-2 rounded-full bg-purple-400 animate-ping opacity-75" title="Live Sync" />
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="group relative overflow-hidden rounded-2xl bg-emerald-950/20 backdrop-blur-xl p-3.5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-lg shadow-emerald-900/10"
          >
            <div className="absolute -top-10 -left-10 h-24 w-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="relative flex-shrink-0">
                {spotifyActivity.icon ? (
                  <img
                    src={spotifyActivity.icon}
                    alt={spotifyActivity.text}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10 shadow-md animate-[spin_10s_linear_infinite]"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20 flex items-center justify-center">
                    <span className="text-xl">🎵</span>
                  </div>
                )}
                {!hasGame && (
                  <span className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-zinc-950 ${statusColors[status]}`} />
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Listening Now</span>
                <span className="text-xs font-semibold text-zinc-100 truncate">{spotifyActivity.text}</span>
                {spotifyActivity.subtext && (
                  <span className="text-[11px] text-zinc-400 truncate">{spotifyActivity.subtext}</span>
                )}
              </div>

              {/* Animated Equalizer Visualizer */}
              <div className="flex items-end gap-0.5 h-4 px-1">
                {[0, 0.2, 0.4, 0.1, 0.3].map((delay, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${delay}s`, animationDuration: '0.8s' }}
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl bg-zinc-900/30 backdrop-blur-xl p-3 border border-white/5 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0 h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs text-zinc-300 font-medium truncate">
                  {loading ? "Syncing status..." : fallbackStatus.text}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
