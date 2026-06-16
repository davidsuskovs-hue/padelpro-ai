"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Pulse = { id: number };

/**
 * Premium CTA button: deep blue with an orange highlight.
 * - On hover, a snappy spring "racket impact" (96% -> 104% -> 100%).
 * - On click, a faint radial pulse expands from the center and fades out.
 */
export default function ImpactButton({ label = "Start Your Journal" }) {
  const [pulses, setPulses] = useState<Pulse[]>([]);

  const handleClick = () => {
    const id = Date.now();
    setPulses((p) => [...p, { id }]);
    setTimeout(() => {
      setPulses((p) => p.filter((x) => x.id !== id));
    }, 700);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: [1, 0.96, 1.04, 1] }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileTap={{ scale: 0.96 }}
      className="relative overflow-hidden rounded-full bg-blue-700 px-10 py-4 text-lg font-bold text-white shadow-lg ring-2 ring-orange-400 transition-colors hover:bg-blue-600"
    >
      {/* Radial pulse(s) on click */}
      {pulses.map((pulse) => (
        <motion.span
          key={pulse.id}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400"
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 12, opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      ))}
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}
