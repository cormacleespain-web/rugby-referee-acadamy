"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

export function DonateSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20" ref={ref}>
      {/* Bold gradient background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80"
        aria-hidden
      />
      {/* Shine overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
        aria-hidden
      />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />

      <div className="container relative px-4 sm:px-6">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl border-2 border-white/20 bg-white/10 px-6 py-12 text-center shadow-2xl backdrop-blur-sm sm:px-12 sm:py-14"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <motion.span
            className="inline-block rounded-full bg-white/25 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 25 }}
          >
            Support the next generation
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Donate to youth refereeing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/95">
            Your contribution helps fund coaching, equipment, and development programmes for young referees around the world.
          </p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 28 }}
          >
            <Link
              href="/contact?subject=donation"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-2.5 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/95 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Donate now
            </Link>
            <Link
              href="/youth"
              className="inline-flex h-9 items-center justify-center rounded-lg border-2 border-white/60 bg-transparent px-2.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Learn about our youth programmes
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
