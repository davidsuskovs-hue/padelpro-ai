"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useSpring,
  type Variants,
} from "framer-motion";

type Metric = {
  label: string;
  value: number;
  suffix: string;
};

const METRICS: Metric[] = [
  { label: "Ball Speed", value: 145, suffix: " km/h" },
  { label: "Smash Accuracy", value: 88, suffix: "%" },
  { label: "Court Coverage", value: 94, suffix: "%" },
  { label: "Spin Rate", value: 2200, suffix: " RPM" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

/** Spring-driven counter: rapid, blurred ticker that snaps sharp at the target. */
function useSpringCounter(target: number, active: boolean, delay: number) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => spring.set(target), delay);
    return () => clearTimeout(timer);
  }, [active, target, delay, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(v));
    return () => unsub();
  }, [spring]);

  return display;
}

function MetricLine({ metric, index }: { metric: Metric; index: number }) {
  const display = useSpringCounter(metric.value, true, index * 150);
  // Blur is proportional to how far the ticker still is from its target,
  // so the number sharpens into focus as it settles.
  const remaining = Math.min(Math.abs(metric.value - display) / metric.value, 1);
  const blur = remaining * 4;

  return (
    <motion.div
      variants={lineVariants}
      className="flex items-baseline justify-between border-b border-slate-700/60 py-3 last:border-b-0"
    >
      <span className="text-sm font-medium uppercase tracking-wider text-slate-400">
        {metric.label}
      </span>
      <span
        className="font-mono text-2xl font-bold text-teal-400 sm:text-3xl"
        style={{ filter: `blur(${blur}px)` }}
      >
        {Math.round(display).toLocaleString()}
        {metric.suffix}
      </span>
    </motion.div>
  );
}

/**
 * High-performance sports analytics loader. When scrolled into view, four
 * metric lines stagger in (0.15s apart) and spring-count from 0 to target,
 * blurring while changing and snapping sharp on settle.
 */
export default function MetricsLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-md">
        <p className="mb-1 text-center text-sm font-semibold uppercase tracking-widest text-orange-400">
          AI Processing
        </p>
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          Your Match, Decoded
        </h2>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-blue-950 p-6 shadow-xl"
        >
          {/* Subtle border grid backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative">
            {inView &&
              METRICS.map((metric, i) => (
                <MetricLine key={metric.label} metric={metric} index={i} />
              ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
