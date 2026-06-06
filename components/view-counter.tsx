"use client";
import { useEffect, useState } from "react";

export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.counterapi.dev/v1/theekz-profile/visits/up")
      .then(res => res.json())
      .then(data => setViews(data.count))
      .catch(() => {});
  }, []);

  if (!views) return null;

  return (
    <div className="flex items-center gap-1.5 text-white/20 text-[10px] tracking-widest mt-1">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
