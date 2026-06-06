"use client";
import { useEffect, useRef } from "react";

export function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dot = dotRef.current!;
    const ctx = canvas.getContext("2d")!;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["rgba(167,139,250,", "rgba(129,140,248,", "rgba(196,181,253,", "rgba(255,255,255,"];

    const drawStar = (x: number, y: number, r: number, color: string, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color + alpha + ")";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI / 5) - Math.PI / 2;
        const b = (i * 4 * Math.PI / 5 + 2 * Math.PI / 5) - Math.PI / 2;
        if (i === 0) ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
        else ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        ctx.lineTo(x + (r * 0.4) * Math.cos(b), y + (r * 0.4) * Math.sin(b));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const onMove = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 4,
          y: e.clientY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          life: 1,
          size: 2 + Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    window.addEventListener("mousemove", onMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        drawStar(p.x, p.y, p.size, p.color, Math.max(0, p.life));
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />
      <div ref={dotRef} className="fixed pointer-events-none z-[9999] w-2 h-2 rounded-full bg-white/70 -translate-x-1/2 -translate-y-1/2" />
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}
