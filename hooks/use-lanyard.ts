"use client";

import { useEffect, useState, useCallback } from "react";
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

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  global_name?: string;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
  };
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  discord_user: DiscordUser;
  activities: Activity[];
  spotify?: {
    song: string;
    artist: string;
    album_art_url?: string;
  };
}

export interface UseLanyardReturn {
  data: LanyardData | null;
  loading: boolean;
  wsConnected: boolean;
  avatarUrl: string | null;
  decorationUrl: string | null;
  status: "online" | "idle" | "dnd" | "offline";
}

export function useLanyard(): UseLanyardReturn {
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

  // Construct Discord avatar URL
  const getAvatarUrl = (): string | null => {
    if (!data?.discord_user) return null;
    
    const { id, avatar } = data.discord_user;
    
    if (!avatar) {
      // Default Discord avatar based on discriminator or user ID
      const defaultIndex = data.discord_user.discriminator === "0" 
        ? (BigInt(id) >> BigInt(22)) % BigInt(6)
        : parseInt(data.discord_user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
    }
    
    // Check if avatar is animated (starts with "a_")
    const extension = avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}.${extension}?size=256`;
  };

  // Construct avatar decoration URL if present
  const getDecorationUrl = (): string | null => {
    if (!data?.discord_user?.avatar_decoration_data) return null;
    
    const { asset } = data.discord_user.avatar_decoration_data;
    // Avatar decorations can be animated
    const extension = asset.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.${extension}?size=256`;
  };

  return {
    data,
    loading,
    wsConnected,
    avatarUrl: getAvatarUrl(),
    decorationUrl: getDecorationUrl(),
    status: data?.discord_status || "offline",
  };
}
