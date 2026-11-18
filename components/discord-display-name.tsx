import type { CSSProperties } from "react";
import localFont from "next/font/local";
import {
  Cherry_Bomb_One, Chicle, Kalam, MuseoModerno, New_Rocker,
  Orbitron, Pixelify_Sans, Playpen_Sans, Zilla_Slab,
} from "next/font/google";
import type { DiscordDisplayNameStyle } from "@/hooks/use-lanyard";
import styles from "./discord-display-name.module.css";

const cherryBomb = Cherry_Bomb_One({ subsets: ["latin"], weight: "400", preload: false });
const chicle = Chicle({ subsets: ["latin"], weight: "400", preload: false });
const museoModerno = MuseoModerno({ subsets: ["latin"], weight: "600", preload: false });
const pixelify = Pixelify_Sans({ subsets: ["latin"], weight: "600", preload: false });
const zillaSlab = Zilla_Slab({ subsets: ["latin"], weight: "600", preload: false });
const playpenSans = Playpen_Sans({ subsets: ["latin"], weight: "600", preload: false });
const orbitron = Orbitron({ subsets: ["latin"], weight: "600", preload: false });
const newRocker = New_Rocker({ subsets: ["latin"], weight: "400", preload: false });
const kalam = Kalam({ subsets: ["latin"], weight: "700", preload: false });
const deluxeDucks = localFont({ src: "../lib/fonts/deluxe-ducks.otf", weight: "400", preload: false });

const fonts: Record<number, CSSProperties> = {
  3: cherryBomb.style,
  4: chicle.style,
  6: museoModerno.style,
  8: pixelify.style,
  11: { fontFamily: "var(--font-geist-sans), sans-serif" },
  12: zillaSlab.style,
  13: playpenSans.style,
  14: orbitron.style,
  15: newRocker.style,
  16: kalam.style,
  // Deluxe Ducks is a public-domain alternative to the Vice City typeface.
  17: deluxeDucks.style,
};

const effects: Record<number, string> = {
  2: styles.gradient,
  3: styles.neon,
  4: styles.toon,
  5: styles.pop,
  6: styles.gradient,
  7: styles.prism,
  8: styles.gummy,
};

interface DiscordDisplayNameProps {
  name: string;
  appearance?: DiscordDisplayNameStyle | null;
}

export function DiscordDisplayName({ name, appearance }: DiscordDisplayNameProps) {
  const font = appearance?.font_id === undefined ? undefined : fonts[appearance.font_id];
  const effect = appearance?.effect_id === undefined ? undefined : effects[appearance.effect_id];
  const colors = (Array.isArray(appearance?.colors) ? appearance.colors : [])
    .filter((color) => Number.isInteger(color) && color >= 0 && color <= 0xffffff)
    .slice(0, 5)
    .map((color) => `#${color.toString(16).padStart(6, "0")}`);
  const color = colors[0] ?? "var(--foreground)";
  const gradient = colors.length > 1
    ? colors.join(", ")
    : `${color}, color-mix(in srgb, ${color} 60%, var(--lavender))`;
  const textStyle = {
    ...font,
    fontFamily: font?.fontFamily ?? "var(--font-display), sans-serif",
    "--name-color": color,
    "--name-gradient": gradient,
  } as CSSProperties;

  return (
    <h2 className="wrap-anywhere text-2xl font-semibold sm:text-3xl">
      <span
        className={[styles.name, appearance?.font_id === 17 && styles.viceCity, effect].filter(Boolean).join(" ")}
        style={textStyle}
      >
        {name}
      </span>
    </h2>
  );
}
