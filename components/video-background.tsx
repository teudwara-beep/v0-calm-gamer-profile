"use client";
import { siteConfig } from "@/lib/config";

export function VideoBackground({ profileOpen }: { profileOpen: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0c101b] bg-[url('/profile-bg.webp')] bg-cover bg-center"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        poster="/profile-bg.webp"
      >
        <source src={siteConfig.videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#090c19]/65 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(5,8,16,0.6)_100%)] backdrop-blur-[3px]" />
      <div
        className={`absolute inset-0 bg-[#0c101b]/80 bg-[radial-gradient(ellipse_at_18%_25%,rgba(139,107,185,0.18),transparent_58%),radial-gradient(ellipse_at_86%_70%,rgba(60,114,153,0.16),transparent_62%)] backdrop-blur-[5px] transition-opacity duration-1000 ease-in-out motion-reduce:transition-none lg:bg-[#0c101b]/55 ${profileOpen ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
