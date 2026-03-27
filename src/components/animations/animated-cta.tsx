"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Link from "next/link";

export function AnimatedCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative w-full overflow-hidden" ref={ref}>
      {/* Soft brand-tinted background */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-primary/[0.04] to-background"
        aria-hidden
      />
      <div className="container relative px-4 py-20 sm:py-24">
        <motion.div
          className="mx-auto max-w-2xl rounded-3xl border border-border/80 bg-card/80 px-6 py-12 text-center shadow-sm backdrop-blur sm:px-12 sm:py-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Ready to improve?</h2>
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
            Join referees worldwide who use Rugby Refereeing Academy for professional feedback.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create an account
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
