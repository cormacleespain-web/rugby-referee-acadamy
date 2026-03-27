"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function assignCoach(submissionId: string, formData: FormData) {
  const coachId = (formData.get("coachId") as string)?.trim();
  if (!coachId) redirect("/admin/submissions");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [myProfile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  if (myProfile?.role !== "admin") redirect("/dashboard");

  const [coach] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, coachId))
    .limit(1);
  if (!coach || coach.role !== "coach") redirect("/admin/submissions?error=Invalid+coach");

  const [sub] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);
  if (!sub || sub.status !== "paid") redirect("/admin/submissions");

  await db
    .update(submissions)
    .set({
      assignedCoachId: coachId,
      status: "assigned",
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
