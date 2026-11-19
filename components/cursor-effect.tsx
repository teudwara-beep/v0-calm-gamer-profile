"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  born: number;
}

const lifetime = 280;
const spawnInterval = 70;

export function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const preference = window.matchMedia("(any-pointer: fine) and (prefers-reduced-motion: no-preference)");
    let particles: Particle[] = [];
    let lastSpawn = -Infinity;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const clear = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      particles = [];
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const animate = (now: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(({ born }) => now - born < lifetime);
      context.fillStyle = "#c4b5fd";
      for (const { x, y, size, born } of particles) {
        const progress = (now - born) / lifetime;
        const center = y - progress * 6;
        context.globalAlpha = 0.52 * (1 - progress) ** 2;
        context.beginPath();
        context.moveTo(x, center - size);
        context.quadraticCurveTo(x + 0.5, center - 0.5, x + size, center);
        context.quadraticCurveTo(x + 0.5, center + 0.5, x, center + size);
        context.quadraticCurveTo(x - 0.5, center + 0.5, x - size, center);
        context.quadraticCurveTo(x - 0.5, center - 0.5, x, center - size);
        context.fill();
      }
      frame = particles.length > 0 ? requestAnimationFrame(animate) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (!preference.matches || event.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastSpawn < spawnInterval) return;

      lastSpawn = now;
      particles.push({ x: event.clientX, y: event.clientY, size: 2 + Math.random() * 1.5, born: now });
      if (frame === 0) frame = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    preference.addEventListener("change", clear);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      preference.removeEventListener("change", clear);
      clear();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9998]" />;
}
