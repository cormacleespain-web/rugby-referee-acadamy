import { AnimatedHero } from "@/components/animations/animated-hero";
import { AnimatedCards } from "@/components/animations/animated-cards";
import { AnimatedCta } from "@/components/animations/animated-cta";
import { DonateSection } from "@/components/home/donate-section";
import { HomeStats } from "@/components/home/home-stats";

export default function HomePage() {
  return (
    <>
      <AnimatedHero />
      <HomeStats />
      <AnimatedCards />
      <DonateSection />
      <AnimatedCta />
    </>
  );
}
