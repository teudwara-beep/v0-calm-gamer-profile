"use client";

import { useState } from "react";

const viewBadge = "https://hits.sh/theekz.vercel.app.svg?label=views&color=272039&labelColor=272039";

export function ViewCounter() {
  const [unavailable, setUnavailable] = useState(false);
  if (unavailable || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") return null;

  return (
    <img
      src={viewBadge}
      alt="Total profile views"
      referrerPolicy="no-referrer"
      className="mt-1 block h-5 w-auto sm:mx-auto"
      onError={() => setUnavailable(true)}
    />
  );
}
