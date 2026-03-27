"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const cards = [
  {
    step: "1",
    title: "Submit your match",
    description:
      "Upload or link to your match footage and choose a service: performance review or coaching with self-review.",
  },
  {
    step: "2",
    title: "Expert analysis",
    description:
      "A professional coach or reviewer analyses your performance and prepares detailed feedback and statistics.",
  },
  {
    step: "3",
    title: "Get your report",
    description:
      "Receive your report in your dashboard. Use the insights to improve and track your progress over time.",
  },
];

export function AnimatedCards() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative w-full border-t border-border bg-muted/40" ref={ref}>
      {/* Subtle top fade */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-background/50 to-transparent" aria-hidden />

      <div className="container relative px-4 py-16 sm:px-6 sm:py-20">
        <motion.p
          className="text-center text-sm font-medium uppercase tracking-wider text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          Simple process
        </motion.p>
        <motion.h2
          className="mt-2 text-center text-2xl font-semibold text-foreground sm:text-3xl"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          How it works
        </motion.h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-lg md:p-8"
              initial={{ opacity: 0, y: 24 }}
              animate={
                inView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 24 }
              }
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
                delay: 0.08 * i,
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-lg font-bold text-primary transition-colors group-hover:bg-primary/25">
                {card.step}
              </div>
              <h3 className="font-semibold text-foreground text-lg">{card.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
