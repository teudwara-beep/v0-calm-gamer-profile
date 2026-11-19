"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { siteConfig } from "@/lib/config";
import activityStyles from "./activity-card.module.css";
import type { ValorantRankData } from "@/app/api/valorant-rank/route";

const refreshInterval = 60_000;
const rankIconBase = "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04";

export function ValorantRank() {
  const [rank, setRank] = useState<ValorantRankData | null>(null);
  const [syncStatus, setSyncStatus] = useState<"hidden" | "synced" | "unavailable">("hidden");
  const [failedIconTier, setFailedIconTier] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let refresh: ReturnType<typeof setTimeout>;

    async function loadRank() {
      try {
        const response = await fetch("/api/valorant-rank", { signal, cache: "no-store" });
        if (response.status === 204) {
          if (!signal.aborted) {
            setRank(null);
            setSyncStatus("hidden");
          }
          return;
        }
        if (!response.ok) throw new Error("Rank unavailable");

        const data: ValorantRankData = await response.json();
        if (signal.aborted) return;
        setRank(data);
        setSyncStatus("synced");
      } catch {
        if (!signal.aborted) setSyncStatus("unavailable");
      } finally {
        if (!signal.aborted) refresh = setTimeout(loadRank, refreshInterval);
      }
    }

    void loadRank();
    return () => {
      controller.abort();
      clearTimeout(refresh);
    };
  }, []);

  if (syncStatus === "hidden") return null;

  const { name, tag } = siteConfig.valorant;
  const hasRankIcon = rank && rank.tierId !== failedIconTier;

  return (
    <section
      aria-label="VALORANT competitive rank"
      className={`${activityStyles.card} ${activityStyles.valorant}`}
    >
      <div className="relative flex items-center gap-3" role="status">
        <div aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${activityStyles.icon}`}>
          {hasRankIcon ? (
            <img
              src={`${rankIconBase}/${rank.tierId}/smallicon.png`}
              alt=""
              width={32}
              height={32}
              className="object-contain"
              onError={() => setFailedIconTier(rank.tierId)}
            />
          ) : (
            <Shield className="h-5 w-5" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className={`text-[10px] font-semibold tracking-widest uppercase ${activityStyles.label}`}>VALORANT</p>
          <p className="text-sm font-semibold text-zinc-100">{rank?.tierName ?? "Rank unavailable"}</p>
          <p className="truncate text-[11px] text-zinc-400">{name}#{tag}{rank && syncStatus === "unavailable" && " · Sync paused"}</p>
        </div>

        {rank?.rr != null && (
          <p className="shrink-0 rounded-lg bg-white/6 px-2 py-1 text-xs font-medium text-zinc-200 tabular-nums">
            {rank.rr} RR
          </p>
        )}
      </div>
    </section>
  );
}
