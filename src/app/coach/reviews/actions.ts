"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { submissions, reports, profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const fromEmail = process.env.CONTACT_EMAIL ?? "onboarding@resend.dev";

export async function submitReport(
  submissionId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const feedback = (formData.get("feedback") as string)?.trim();
  const performanceInsights = (formData.get("performanceInsights") as string)?.trim() ?? null;
  if (!feedback) return { error: "Feedback is required." };

  const db = getDb();
  const [sub] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);
  if (!sub || sub.assignedCoachId !== user.id)
    return { error: "Submission not found or not assigned to you." };
  if (sub.status !== "assigned" && sub.status !== "in_review")
    return { error: "This submission is no longer available for review." };

  await db.insert(reports).values({
    submissionId,
    coachId: user.id,
    feedback,
    performanceInsights,
    publishedAt: new Date(),
  });

  await db
    .update(submissions)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  const [refereeProfile] = await db
    .select({ email: profiles.email, fullName: profiles.fullName })
    .from(profiles)
    .where(eq(profiles.id, sub.userId))
    .limit(1);

  if (refereeProfile?.email && process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: fromEmail,
      to: refereeProfile.email,
      subject: "Your Referee Academy report is ready",
      text: `Hi${refereeProfile.fullName ? ` ${refereeProfile.fullName}` : ""},\n\nYour performance review report has been completed. You can view it in your dashboard:\n\n${appUrl}/dashboard/submissions/${submissionId}\n\nBest,\nReferee Academy`,
    });
  }

  revalidatePath("/coach");
  revalidatePath(`/coach/reviews/${submissionId}`);
  return { success: true };
}
