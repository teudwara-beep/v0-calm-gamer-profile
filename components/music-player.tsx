"use client";

import { useEffect, useRef, useState } from "react";
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
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (audioRef.current) {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setHasError(false);
      audio.volume = volume;
    };
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
      setPlaying(false);
    };
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (hasError) return;
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (playing) {
        audio.pause();
        setPlaying(false);
      } else {
        await audio.play();
        setPlaying(true);
      }
    } catch (err) {
      console.warn("Audio play failed:", err);
      setHasError(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={hasError ? undefined : src} loop />

      <div
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {/* Tooltip */}
        <div
          className={`absolute bottom-16 right-0 mb-2 transition-all duration-500 ${
            playing && !hasError
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl min-w-max">
            <div className="flex flex-col items-end">
              <p className="text-white/70 text-[11px] font-light tracking-wide">
                {songName} — {artist}
              </p>
              <p className="text-indigo-300/50 text-[9px] font-mono tracking-[0.2em] mt-0.5">
                {version}
              </p>
              <div className="flex gap-1 mt-2 items-end h-3">
                {[0.6, 0.9, 0.5, 0.8, 0.4].map((height, i) => (
                  <div
                    key={i}
                    className="w-1 bg-indigo-400/60 rounded-full transition-all duration-300"
                    style={{
                      height: playing ? `${height * 12}px` : "3px",
                      animation: playing
                        ? `barPulse ${0.6 + i * 0.1}s ease-in-out infinite alternate`
                        : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Volume button with slider */}
          <div className="relative">
            {showVolumeSlider && (
              <div className="absolute bottom-0 right-10 p-3 bg-white/10 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  style={{
                    width: "80px",
                    height: "3px",
                    background: `linear-gradient(to right, rgba(167,139,250,0.8) ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%)`,
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                />
              </div>
            )}
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-indigo-400/30 text-white/50 hover:text-white/80"
            >
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>

          {/* Play/pause button */}
          <button
            onClick={togglePlay}
            disabled={hasError}
            className={`relative w-14 h-14 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-500 ease-out ${
              playing
                ? "bg-indigo-500/20 border-indigo-400/40"
                : "bg-white/5 border-white/15 hover:bg-white/10"
            } border hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              boxShadow: playing ? "0 0 20px rgba(99,102,241,0.3)" : "0 0 10px rgba(0,0,0,0.2)",
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-indigo-400 rounded-full animate-spin" />
            ) : hasError ? (
              <span className="text-white/40 text-xs">⚠️</span>
            ) : playing ? (
              <Pause size={20} className="text-indigo-300 fill-indigo-300/20" />
            ) : (
              <Play size={20} className="text-white/70 ml-0.5" />
            )}
            {playing && !hasError && (
              <span className="absolute inset-0 rounded-full animate-ping-slow border border-indigo-400/40" />
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes barPulse {
          0% { transform: scaleY(0.4); opacity: 0.4; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes ping-slow {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-slow { animation: ping-slow 1.8s cubic-bezier(0,0,0.2,1) infinite; }
        .volume-slider { -webkit-appearance: none; appearance: none; background: transparent; }
        .volume-slider:focus { outline: none; }
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 12px; height: 12px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.5);
          cursor: pointer; box-shadow: 0 0 6px rgba(167,139,250,0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2); box-shadow: 0 0 12px rgba(167,139,250,0.8);
        }
        .volume-slider::-moz-range-thumb {
          width: 12px; height: 12px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          border-radius: 50%; border: none; cursor: pointer;
        }
        .volume-slider::-moz-range-track { height: 3px; background: transparent; }
      `}</style>
    </>
  );
}
