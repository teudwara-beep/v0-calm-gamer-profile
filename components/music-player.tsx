"use client";

import { useEffect, useId, useState } from "react";
import type { RefObject } from "react";
import { CircleAlert, Pause, Play, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  onVolumeChange: (volume: number) => void;
  songName?: string;
  artist?: string;
  version?: string;
}

export function MusicPlayer({
  audioRef,
  onVolumeChange,
  songName = "Criminal",
  artist = "Britney Spears",
  version = "slowed + reverb",
}: MusicPlayerProps) {
  const volumeControlsId = useId();
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(() => audioRef.current?.volume ?? 1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlayback = () => {
      const playing = !audio.paused && !audio.error;
      setPlaying(playing);
      setIsLoading(playing && audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
      setHasError(audio.error !== null);
    };
    const events = ["play", "playing", "waiting", "pause", "error"];
    const syncVolume = () => setVolume(Math.round(audio.volume * 100) / 100);

    syncPlayback();
    syncVolume();
    for (const event of events) audio.addEventListener(event, syncPlayback);
    audio.addEventListener("volumechange", syncVolume);
    return () => {
      for (const event of events) audio.removeEventListener(event, syncPlayback);
      audio.removeEventListener("volumechange", syncVolume);
    };
  }, [audioRef]);

  const changeVolume = (nextVolume: number) => {
    onVolumeChange(nextVolume);
    setVolume(nextVolume);
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setIsLoading(true);
      await audio.play();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="group"
      aria-label="Background music"
      className="pointer-events-auto relative flex w-fit min-w-0 max-w-full items-center gap-3 rounded-full border border-lavender/25 bg-[#141726]/85 p-1.5 pr-2 shadow-[0_10px_36px_-12px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:pl-2"
    >
      <button
        onClick={togglePlay}
        disabled={hasError}
        aria-label={hasError ? "Music unavailable" : playing ? "Pause music" : "Play music"}
        className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender disabled:opacity-50 ${
          playing ? "border-lavender/30 bg-lavender/15 text-[#e3daef]" : "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
        }`}
      >
        {isLoading ? (
          <span className="size-4 animate-spin rounded-full border-2 border-lavender/30 border-t-lavender motion-reduce:animate-none" />
        ) : hasError ? (
          <CircleAlert aria-hidden="true" size={16} />
        ) : playing ? (
          <Pause aria-hidden="true" size={16} />
        ) : (
          <Play aria-hidden="true" size={16} className="ml-0.5" />
        )}
      </button>

      <div className="min-w-0 sm:min-w-[9.5rem]">
        <p className="truncate text-xs font-medium leading-4 text-[#e3daef]">
          {songName}
        </p>
        <p className="truncate text-[11px] leading-4 text-zinc-400">
          {artist} · {version}
        </p>
      </div>

      <div className="relative shrink-0 border-l border-lavender/20 pl-1.5">
        <button
          onClick={() => setShowVolumeSlider((open) => !open)}
          aria-label={showVolumeSlider ? "Hide volume controls" : "Show volume controls"}
          aria-expanded={showVolumeSlider}
          aria-controls={volumeControlsId}
          className="flex size-9 items-center justify-center rounded-full text-[#cbbfe3] transition-colors duration-300 hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
        >
          {volume === 0 ? <VolumeX aria-hidden="true" size={16} /> : <Volume2 aria-hidden="true" size={16} />}
        </button>
        <div
          id={volumeControlsId}
          hidden={!showVolumeSlider}
          className="absolute right-0 bottom-[calc(100%+1rem)] rounded-full border border-lavender/25 bg-[#141726]/95 px-4 py-2 shadow-lg backdrop-blur-xl"
        >
          <input
            type="range"
            aria-label="Music volume"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => changeVolume(e.currentTarget.valueAsNumber)}
            className="volume-slider block h-1 w-28 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #b6a7df ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
            }}
          />
        </div>
      </div>

      <style>{`
        .volume-slider {
          appearance: none;
          border-radius: 9999px;
        }
        .volume-slider:focus-visible {
          outline: 2px solid #c4b5fd;
          outline-offset: 4px;
        }
        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d9ccf5;
        }
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border: none;
          border-radius: 50%;
          background: #d9ccf5;
        }
      `}</style>
    </div>
  );
}
