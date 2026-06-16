"use client";

import { useEffect, useRef } from "react";
import { useScroll } from "framer-motion";

type TrailPoint = { x: number; y: number; born: number };

/**
 * A scroll-driven canvas animation of a padel court.
 * As the user scrolls through the section, the court lines reveal with a
 * neon stroke, and a glowing ball bounces (elastic spring feel) from the
 * back glass toward the service box, leaving a fading heatmap trail.
 */
export default function CourtScrollAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const trail: TrailPoint[] = [];
    let raf = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Draw a line revealing from start to end based on `reveal` (0..1).
    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      reveal: number,
      color: string
    ) => {
      const r = Math.max(0, Math.min(1, reveal));
      if (r <= 0) return;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + (x2 - x1) * r, y1 + (y2 - y1) * r);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      const p = scrollYProgress.get(); // 0..1
      const now = performance.now();
      ctx.clearRect(0, 0, width, height);

      // Court geometry (padel court is 2:1 — 20m x 10m).
      const margin = Math.min(width, height) * 0.12;
      const cw = width - margin * 2;
      const chRaw = cw / 2;
      const ch = Math.min(chRaw, height - margin * 2);
      const left = (width - cw) / 2;
      const top = (height - ch) / 2;
      const right = left + cw;
      const bottom = top + ch;
      const midX = left + cw / 2;
      const blue = "#38bdf8";
      const teal = "#2dd4bf";

      // Stroke-reveal of court lines, staggered across the first 70% of scroll.
      const stage = (start: number, end: number) =>
        Math.max(0, Math.min(1, (p - start) / (end - start)));

      // Outer rectangle
      const o = stage(0, 0.35);
      drawLine(left, top, right, top, o, blue);
      drawLine(right, top, right, bottom, o, blue);
      drawLine(right, bottom, left, bottom, o, blue);
      drawLine(left, bottom, left, top, o, blue);
      // Net (center)
      drawLine(midX, top, midX, bottom, stage(0.25, 0.45), teal);
      // Service lines (3m in from each back wall ~ 0.15 of length)
      const slLeft = left + cw * 0.25;
      const slRight = right - cw * 0.25;
      const sl = stage(0.4, 0.6);
      drawLine(slLeft, top, slLeft, bottom, sl, teal);
      drawLine(slRight, top, slRight, bottom, sl, teal);
      // Center service line
      drawLine(slLeft, top + ch / 2, slRight, top + ch / 2, stage(0.55, 0.7), teal);

      // ---- Ball trajectory (starts after court is mostly drawn) ----
      const tRaw = stage(0.45, 1);
      if (tRaw > 0) {
        const t = tRaw;
        // Horizontal: from back glass (left) toward the service box.
        const bx = left + cw * (0.06 + 0.6 * t);
        // Vertical: elastic bounces with decaying amplitude (spring feel).
        const nBounces = 3;
        const floorY = bottom - 8;
        const amp = ch * 0.55 * Math.pow(1 - t, 1.25);
        const by = floorY - amp * Math.abs(Math.sin(t * Math.PI * nBounces));

        // Record + fade the heatmap trail (dissolves over 500ms).
        trail.push({ x: bx, y: by, born: now });
        while (trail.length && now - trail[0].born > 500) trail.shift();

        for (const pt of trail) {
          const age = now - pt.born;
          const a = Math.max(0, 1 - age / 500);
          const rad = 10 + (1 - a) * 16;
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
          grad.addColorStop(0, `rgba(251, 146, 60, ${0.5 * a})`);
          grad.addColorStop(1, "rgba(251, 146, 60, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
          ctx.fill();
        }

        // The glowing neon ball
        ctx.save();
        ctx.shadowColor = "#fde047";
        ctx.shadowBlur = 24;
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(bx, by, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        trail.length = 0;
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative h-[250vh] bg-blue-950">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-300">
          Scroll to rally
        </p>
        <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
          The Court, Reimagined
        </h2>
        <canvas
          ref={canvasRef}
          className="h-[55vh] w-[90vw] max-w-3xl"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
