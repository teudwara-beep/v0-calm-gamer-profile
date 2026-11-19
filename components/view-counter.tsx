"use client";

import { useState } from "react";

const viewBadge = "https://hits.sh/theekz.vercel.app.svg?style=flat-square&label=views&labelColor=transparent&color=transparent";

export function ViewCounter() {
  const [unavailable, setUnavailable] = useState(false);
  if (unavailable || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return null;

  return (
    <span className="inline-flex items-center gap-3">
      <span aria-hidden="true" className="size-[3px] rounded-full bg-lavender/50" />
      <img
        src={viewBadge}
        alt="Total profile views"
        referrerPolicy="no-referrer"
        className="block h-5 w-auto opacity-65"
        onError={() => setUnavailable(true)}
      />
    </span>
  );
}
