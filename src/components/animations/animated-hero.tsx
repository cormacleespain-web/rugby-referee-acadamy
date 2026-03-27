"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import heroImage from "../../../images/image 0.jpeg";

export function AnimatedHero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background: gradient + subtle grid */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.62_0.18_45/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_70%)]" />
        <div
          className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(to right, oklch(0.21_0.01_265/0.06) 1px, transparent 1px),
              linear-gradient(to bottom, oklch(0.21_0.01_265/0.06) 1px, transparent 1px)
            `,
            backgroundSize: "3rem 3rem",
          }}
        />
      </div>

      <div className="container relative flex flex-col items-center gap-10 px-4 py-20 text-center sm:py-28 md:py-36">
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          Built for referees at every level
        </motion.span>
        <motion.h1
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1] max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.05 }}
        >
          Professional match review and coaching for referees
        </motion.h1>
        <motion.p
          className="text-muted-foreground max-w-2xl text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
          }}
        >
          Submit your match footage for expert analysis. Get detailed feedback,
          performance insights, and coaching from experienced referees.
        </motion.p>
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.2,
          }}
        >
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Get started
          </Link>
          <Link
            href="/pricing"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View pricing
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
