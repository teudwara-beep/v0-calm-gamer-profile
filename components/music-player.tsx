"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  songName?: string;
  artist?: string;
  version?: string;
  src?: string;
}

export function MusicPlayer({
  songName = "Criminal",
  artist = "Britney Spears",
  version = "slowed + reverb",
  src = "/bg-music.mp3",
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [showVolume, setShowVolume] = useState(false);
  const [reduced, setReduced] = useState(false);

  // gentle appear
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // audio wiring
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.loop = true;
    a.preload = "metadata";
    a.volume = volume;

    const onLoad = () => setIsLoading(true);
    const onCan = () => { setIsLoading(false); setHasError(false); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onErr = () => { setIsLoading(false); setHasError(true); setPlaying(false); };

    a.addEventListener("loadstart", onLoad);
    a.addEventListener("canplay", onCan);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("error", onErr);
    return () => {
      a.removeEventListener("loadstart", onLoad);
      a.removeEventListener("canplay", onCan);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("error", onErr);
    };
  }, [volume]);

  // pause when tab hidden
  useEffect(() => {
    const onVis = () => { if (document.hidden) audioRef.current?.pause(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const fadeTo = useCallback((target: number, ms = 700) => {
    const a = audioRef.current;
    if (!a) return;
    const startVol = a.volume;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / ms, 1);
      a.volume = startVol + (target - startVol) * p;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const togglePlay = useCallback(async () => {
    if (hasError) return;
    const a = audioRef.current;
    if (!a) return;
    try {
      if (playing) {
        fadeTo(0, 400);
        setTimeout(() => a.pause(), 380);
      } else {
        setIsLoading(true);
        a.volume = 0;
        await a.play();
        fadeTo(volume, 900);
      }
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }, [playing, hasError, fadeTo, volume]);

  // keep audio volume in sync when slider moves while playing
  useEffect(() => {
    const a = audioRef.current;
    if (!a ||!playing) return;
    a.volume = volume;
  }, [volume, playing]);

  return (
    <>
      <audio ref={audioRef} src={hasError? undefined : src} />

      <div
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-1000 ${
          visible? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* calm tooltip */}
        <div
          className={`absolute bottom-16 right-0 mb-2 transition-all duration-700 ${
            playing &&!hasError? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-[#0b1220]/55 backdrop-blur-2xl border border-white/8 rounded-2xl px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col items-end">
              <p className="text-white/65 text- tracking-wide font-light">
                {songName} — {artist}
              </p>
              <p className="text-violet-300/50 text- font-mono tracking-widest mt-0.5">
                {version}
              </p>
              <div className="flex gap-1 mt-2.5 items-end h-3">
                {[0.55, 0.8, 0.45, 0.7, 0.38].map((h, i) => (
                  <div
                    key={i}
                    className="w- rounded-full"
                    style={{
                      height: playing &&!reduced? `${h * 10 + 2}px` : "3px",
                      background: "linear-gradient(180deg, rgba(167,139,250,0.75), rgba(167,139,250,0.35))",
                      transition: "height 600ms ease",
                      animation: playing &&!reduced? `calmBar ${1.4 + i * 0.12}s ease-in-out infinite alternate` : "none",
                      animationDelay: `${i * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* volume */}
          <div className="relative" onMouseLeave={() => setShowVolume(false)}>
            <div
              className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
                showVolume? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
              }`}
            >
              <div className="p-2.5 bg-white/[0.06] backdrop-blur-2xl rounded-xl border border-white/10 shadow-xl">
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="volume"
                  style={{ width: 84 }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowVolume((v) =>!v)}
              aria-label="Volume"
              className="w-9 h-9 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/55 hover:text-white/80 hover:bg-white/[0.07] transition-all duration-300"
            >
              {volume === 0? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>

          {/* play */}
          <button
            onClick={togglePlay}
            disabled={hasError}
            aria-label={playing? "Pause music" : "Play music"}
            className={`relative w- h- rounded-full backdrop-blur-2xl border transition-all duration-500 flex items-center justify-center
              ${playing
               ? "bg-violet-500/10 border-violet-300/20"
                : "bg-white/[0.04] border-white/12 hover:bg-white/[0.07] hover:border-white/20"
              } hover:scale-[1.03] active:scale-95 disabled:opacity-40`}
            style={{
              boxShadow: playing
               ? "0 0 0 1px rgba(167,139,250,0.08) inset, 0 6px 24px rgba(99,102,241,0.12)"
                : "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {isLoading? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-violet-300/80 rounded-full animate-spin" />
            ) : hasError? (
              <span className="text-white/40 text-xs">•</span>
            ) : playing? (
              <Pause size={18} className="text-violet-200/90" />
            ) : (
              <Play size={18} className="text-white/70 ml-0.5" />
            )}
            {playing &&!reduced &&!hasError && (
              <span className="absolute inset-0 rounded-full border border-violet-300/15 animate-[breathe_3.5s_ease-in-out_infinite]" />
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes calmBar { from { transform: scaleY(0.6); opacity: 0.7; } to { transform: scaleY(1); opacity: 1; } }
        @keyframes breathe { 0%,100% { transform: scale(0.97); opacity: 0.45; } 50% { transform: scale(1.06); opacity: 0.15; } }
       .volume { -webkit-appearance: none; appearance: none; height: 3px; background: linear-gradient(to right, rgba(167,139,250,0.8) 0%, rgba(167,139,250,0.8) var(--p,35%), rgba(255,255,255,0.18) var(--p,35%), rgba(255,255,255,0.18) 100%); border-radius: 10px; outline: none; }
       .volume::-webkit-slider-thumb { -webkit-appearance: none; width: 11px; height: 11px; border-radius: 50%; background: #c4b5fd; border: 1.5px solid rgba(255,255,255,0.6); box-shadow: 0 0 6px rgba(167,139,250,0.4); transition: transform 0.15s; }
       .volume::-webkit-slider-thumb:hover { transform: scale(1.15); }
       .volume::-moz-range-thumb { width: 11px; height: 11px; border-radius: 50%; background: #c4b5fd; border: none; }
       .volume::-moz-range-track { height: 3px; background: transparent; }
        @media (prefers-reduced-motion: reduce) { * { animation: none!important; transition: none!important; } }
      `}</style>

      <script dangerouslySetInnerHTML={{ __html: `document.querySelectorAll('.volume').forEach(s=>s.style.setProperty('--p', s.value*100+'%'))` }} />
    </>
  );
}
