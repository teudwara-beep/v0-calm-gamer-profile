 Theekz — Gamer Profile

A calm, lofi-inspired personal gamer profile built with Next.js.

 Features

- Live Discord presence via Lanyard API
- Live profile-card name, color, and display effects from Discord
- Auto-updating VALORANT competitive rank and RR for Theekz#4392 (AP, PC)
- Real-time Spotify now listening
- Animated background video
- Custom star trail cursor
- Scroll, swipe up, or select Enter Profile to open the profile and start background music when the browser allows autoplay
- Profile view counter via Hits.sh
- Smooth page transitions

 Stack

- Next.js
- Tailwind CSS
- Framer Motion
- Lanyard API

## VALORANT rank setup

1. Generate an API key in the [HenrikDev dashboard](https://api.henrikdev.xyz/dashboard/).
2. Add `HENRIKDEV_API_KEY` in the Vercel project's **Settings → Environment Variables** for **Production**. Include **Preview** if you want the card on preview deployments. For local development, put the variable in `.env.local`.
3. Deploy with the variable set, then select **Enter Profile** while Discord shows you as playing VALORANT.

The rank card appears below Discord activity while Lanyard reports that you are playing VALORANT and hides when that activity ends. The card checks for rank updates every minute while visible, and the server caches successful rank lookups for five minutes. The Riot ID, region, and platform are set in `lib/config.ts`.

The Vice City display style uses [Deluxe Ducks](https://typodermicfonts.com/public-domain/), a public-domain typeface by Ray Larabie. Other supported Discord fonts use their public Google Fonts editions.

 Live

[theekz.vercel.app](https://theekz.vercel.app)
