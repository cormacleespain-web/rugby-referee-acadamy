"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const stats = [
  { value: "500+", label: "Match reviews" },
  { value: "50+", label: "Countries" },
  { value: "Expert", label: "Coaches & reviewers" },
];

export function HomeStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="w-full border-y border-border bg-muted/30 py-10 sm:py-12" ref={ref}>
      <div className="container px-4 sm:px-6">
        <motion.div
          className="mx-auto grid max-w-4xl grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {stat.value}
              </div>
              <div className="text-muted-foreground mt-1 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
