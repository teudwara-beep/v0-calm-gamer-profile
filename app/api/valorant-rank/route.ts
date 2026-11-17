import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/config";

export interface ValorantRankData {
  tierId: number;
  tierName: string;
  rr: number | null;
}

interface HenrikMmrResponse {
  data?: {
    current?: {
      tier?: { id?: number; name?: string };
      rr?: number;
    };
  };
  errors?: { code: number }[];
}

const { name, tag, region, platform } = siteConfig.valorant;
const playerPath = [region, platform, name, tag].map(encodeURIComponent).join("/");
const unranked: ValorantRankData = { tierId: 0, tierName: "Unranked", rr: null };
const headers = { "Cache-Control": "no-store" };

const getRank = unstable_cache(
  async (): Promise<ValorantRankData> => {
    // Keep the API key and upstream response on the server.
    const response = await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${playerPath}`, {
      headers: { Authorization: process.env.HENRIKDEV_API_KEY!.trim() },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`HenrikDev returned HTTP ${response.status}`);
    }

    const payload: HenrikMmrResponse = await response.json();
    if (response.status === 404 && payload.errors?.some((error) => error.code === 25)) {
      return unranked;
    }
    if (!response.ok) {
      throw new Error(`HenrikDev returned HTTP ${response.status}`);
    }

    const current = payload.data?.current;
    const tierId = current?.tier?.id;
    const tierName = current?.tier?.name;
    const rr = current?.rr;

    if (tierId === 0) return unranked;
    if (
      typeof tierId !== "number" || !Number.isInteger(tierId) || tierId < 0 ||
      typeof tierName !== "string" || !tierName.trim() ||
      typeof rr !== "number" || !Number.isInteger(rr) || rr < 0
    ) {
      throw new Error("HenrikDev returned invalid rank data");
    }

    return { tierId, tierName: tierName.trim(), rr };
  },
  ["valorant-rank", playerPath],
  { revalidate: 300 },
);

export async function GET() {
  if (!process.env.HENRIKDEV_API_KEY?.trim()) {
    return new Response(null, { status: 204, headers });
  }

  try {
    return Response.json(await getRank(), { headers });
  } catch (error) {
    console.error("Failed to fetch VALORANT rank", error);
    return Response.json({ error: "Rank unavailable" }, { status: 503, headers });
  }
}
