"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * An interactive sports-tech feature card.
 * - Smooth 3D tilt on hover (max 5 degrees), spring-damped.
 * - A neon "scanning laser" sweeps top -> bottom on a 1.5s infinite loop.
 * - An AI "data matrix" grid fades in at 20% opacity on hover.
 */
export default function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-5, 5]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    setHovered(false);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className="flex justify-center py-20" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-80 w-80 overflow-hidden rounded-2xl border border-teal-400/30 bg-gradient-to-br from-blue-800 to-blue-950 p-8 shadow-2xl"
      >
        {/* AI data matrix grid (fades in on hover) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,191,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.6) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          animate={{ opacity: hovered ? 0.2 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Scanning laser */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, #2dd4bf, transparent)",
            boxShadow: "0 0 12px 2px rgba(45,212,191,0.8)",
          }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />

        {/* Card content */}
        <div style={{ transform: "translateZ(40px)" }}>
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            AI Analysis
          </span>
          <h3 className="mt-3 text-2xl font-bold text-white">
            Shot Intelligence
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-blue-200">
            Every swing measured, every pattern learned. PadelPro AI turns your
            matches into a roadmap for getting better, faster.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
