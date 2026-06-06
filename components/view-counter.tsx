"use client";
import { useEffect, useState } from "react";

export function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://api.countapi.xyz/hit/theekz.vercel.app/visits")
      .then(res => res.json())
      .then(data => setViews(data.value))
      .catch(() => {});
  }, []);

  if (!views) return null;

  return (
    <div className="flex items-center gap-1.5 text-white/20 text-[10px] tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-pulse" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
