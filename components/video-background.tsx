"use client";

import { siteConfig } from "@/lib/config";

export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video element */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/placeholder.svg?height=1080&width=1920"
      >
        <source src={siteConfig.videoSrc} type="video/mp4" />
      </video>
      
      {/* Dark translucent overlay with subtle vignette */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, oklch(0.12 0.01 260 / 70%) 100%)"
        }}
      />
    </div>
  );
}
