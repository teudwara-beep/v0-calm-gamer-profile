 Theekz — Gamer Profile

A calm, lofi-inspired personal gamer profile built with Next.js.

 Features

- Live Discord presence via Lanyard API
- Auto-updating VALORANT competitive rank and RR for Theekz#4392 (AP, PC)
- Real-time Spotify now listening
- Animated background video
- Custom star trail cursor
- Music player with volume control
- View counter
- Smooth page transitions

 Stack

- Next.js
- Tailwind CSS
- Framer Motion
- Lanyard API

## VALORANT rank setup

1. Generate an API key in the [HenrikDev dashboard](https://api.henrikdev.xyz/dashboard/).
2. Add `HENRIKDEV_API_KEY` in the Vercel project's **Settings → Environment Variables** for **Production**. Include **Preview** if you want the card on preview deployments. For local development, put the variable in `.env.local`.
3. Deploy with the variable set, then select **Enter Profile** to see the rank below Discord activity.

The profile checks for updates every minute while open. The server caches successful rank lookups for five minutes. The card appears once an API key is configured. The Riot ID, region, and platform are set in `lib/config.ts`.

 Live

[theekz.vercel.app](https://theekz.vercel.app)
