"use client";
import { siteConfig } from "@/lib/config";
export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        aria-hidden="true"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/profile-bg.webp"
      >
        <source src={siteConfig.videoSrc} type="video/mp4" />
      </video>
      
      {/* Very light overlay - no background color, just slight blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)"
        }}
      />
    </div>
  );
}
