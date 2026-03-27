import { getDb } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { asc, eq } from "drizzle-orm";
import { AnimatedTeamCard } from "@/components/animations/animated-team-card";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  let members: InferSelectModel<typeof teamMembers>[] = [];
  try {
    const db = getDb();
    members = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.visible, true))
      .orderBy(asc(teamMembers.displayOrder));
  } catch {
    // DB not available at build or runtime
  }

  return (
    <div className="container px-4 py-14 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our team</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        Coaches and reviewers who support Referee Academy. Each brings
        experience from the field and a commitment to referee development.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-12 text-center">
            Team profiles will appear here. Check back soon.
          </p>
        ) : (
          members.map((member, index) => (
            <AnimatedTeamCard key={member.id} member={member} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
