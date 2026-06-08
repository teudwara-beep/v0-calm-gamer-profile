"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";

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
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("musicPlayerVolume");
      return saved !== null ? parseFloat(saved) : 0.3;
    }
    return 0.3;
  });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Auto-fade in after 1 second
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Save volume to localStorage
  useEffect(() => {
    localStorage.setItem("musicPlayerVolume", volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio event listeners
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
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [volume]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space - play/pause
      if (e.code === "Space" && document.activeElement?.tagName !== "BUTTON") {
        e.preventDefault();
        togglePlay();
      }
      // M - mute/unmute
      else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      }
      // ArrowUp - volume up
      else if (e.code === "ArrowUp") {
        e.preventDefault();
        setVolume(prev => Math.min(1, prev + 0.05));
      }
      // ArrowDown - volume down
      else if (e.code === "ArrowDown") {
        e.preventDefault();
        setVolume(prev => Math.max(0, prev - 0.05));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playing, hasError]);

  const togglePlay = useCallback(async () => {
    if (hasError) return;
    const audio = audioRef.current;
    if (!audio) return;

    setUserInteracted(true);

    try {
      if (playing) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (err) {
      console.warn("Audio play failed:", err);
      setHasError(true);
    }
  }, [playing, hasError]);

  const toggleMute = useCallback(() => {
    setVolume(prev => (prev > 0 ? 0 : 0.3));
  }, []);

  const retryLoad = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    const audio = audioRef.current;
    if (audio) {
      audio.load();
    }
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <>
      <audio ref={audioRef} src={hasError ? undefined : src} loop preload="auto" />

      <div
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-1000 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {/* Glass Tooltip - only visible when playing */}
        <div
          className={`absolute bottom-16 right-0 mb-3 transition-all duration-500 ${
            playing && !hasError
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl blur-xl" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl shadow-indigo-500/10">
              <div className="flex flex-col items-end">
                <p className="text-white/80 text-[11px] font-light tracking-wide">
                  {songName} — {artist}
                </p>
                <p className="text-indigo-300/60 text-[9px] font-mono tracking-[0.2em] mt-0.5">
                  {version}
                </p>
                {/* Animated bars */}
                <div className="flex gap-1.5 mt-2 items-end h-3">
                  {[0.6, 0.9, 0.5, 0.8, 0.4].map((height, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-indigo-400 to-purple-400 rounded-full transition-all duration-300"
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
        </div>

        {/* Main Controls */}
        <div className="flex items-center gap-3">
          {/* Volume button with glass slider */}
          <div
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <button
              onClick={toggleMute}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:border-indigo-400/50 text-white/60 hover:text-white shadow-lg shadow-black/20"
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              title={`Volume: ${Math.round(volume * 100)}% (M to mute)`}
            >
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>

            {/* Glass volume slider */}
            {showVolumeSlider && (
              <div className="absolute bottom-full right-0 mb-3 p-3 bg-white/10 backdrop-blur-2xl rounded-xl border border-white/20 shadow-2xl animate-fadeIn">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  style={{
                    width: "90px",
                    height: "3px",
                    background: `linear-gradient(to right, 
                      rgba(167, 139, 250, 0.9) 0%, 
                      rgba(167, 139, 250, 0.9) ${volume * 100}%, 
                      rgba(255, 255, 255, 0.2) ${volume * 100}%, 
                      rgba(255, 255, 255, 0.2) 100%)`,
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                  aria-label="Volume control"
                  title={`Volume: ${Math.round(volume * 100)}%`}
                />
              </div>
            )}
          </div>

          {/* Main Play/Pause button - extra glassy */}
          <button
            onClick={togglePlay}
            disabled={hasError}
            className={`
              relative w-16 h-16 rounded-full backdrop-blur-2xl flex items-center justify-center
              transition-all duration-500 ease-out
              ${
                playing
                  ? "bg-indigo-500/30 border-indigo-400/60 shadow-2xl shadow-indigo-500/30"
                  : "bg-white/10 border-white/30 hover:bg-white/20"
              }
              border hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-black/30
            `}
            style={{
              boxShadow: playing
                ? "0 0 30px rgba(99,102,241,0.4), inset 0 0 20px rgba(255,255,255,0.1)"
                : "0 0 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
            aria-label={playing ? "Pause" : "Play"}
            title={playing ? "Pause (Space)" : "Play (Space)"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-indigo-400 rounded-full animate-spin" />
            ) : hasError ? (
              <RotateCcw
                size={20}
                className="text-white/80 hover:text-white transition cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  retryLoad();
                }}
                title="Retry"
              />
            ) : playing ? (
              <Pause size={24} className="text-indigo-200 fill-indigo-300/30 drop-shadow-md" />
            ) : (
              <Play size={24} className="text-white/80 ml-0.5 drop-shadow-md" />
            )}

            {/* Glass pulse ring when playing */}
            {playing && !hasError && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping-slow border border-indigo-400/60" />
                <span className="absolute inset-0 rounded-full animate-pulse border border-white/20" />
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes barPulse {
          0% {
            transform: scaleY(0.4);
            opacity: 0.4;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        /* Custom volume slider styling */
        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .volume-slider:focus {
          outline: none;
        }
        
        /* WebKit thumb */
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          cursor: pointer;
          box-shadow: 0 0 8px rgba(167, 139, 250, 0.6);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 0 14px rgba(167, 139, 250, 0.9);
        }
        
        /* Firefox thumb */
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #a78bfa, #818cf8);
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .volume-slider::-moz-range-thumb:hover {
          transform: scale(1.25);
        }
        
        /* Firefox track */
        .volume-slider::-moz-range-track {
          height: 3px;
          background: transparent;
        }
      `}</style>
    </>
  );
}
