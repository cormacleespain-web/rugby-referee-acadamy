"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createSubmission(serviceSlug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.slug, serviceSlug))
    .limit(1);
  if (!service) redirect("/dashboard/submissions/new?error=Invalid+service");

  const [inserted] = await db
    .insert(submissions)
    .values({
      userId: user.id,
      serviceId: service.id,
      status: "draft",
    })
    .returning();
  if (!inserted) redirect("/dashboard/submissions/new?error=Failed+to+create");

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/submissions");
  redirect(`/dashboard/submissions/${inserted.id}/edit`);
}

export async function updateSubmissionVideo(
  submissionId: string,
  formData: FormData
) {
  const videoUrl = (formData.get("videoUrl") as string)?.trim() ?? "";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [existing] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);
  if (!existing || existing.userId !== user.id || existing.status !== "draft")
    redirect("/dashboard/submissions");

  await db
    .update(submissions)
    .set({ videoUrl: videoUrl || null, updatedAt: new Date() })
    .where(eq(submissions.id, submissionId));
  revalidatePath(`/dashboard/submissions/${submissionId}`);
  revalidatePath(`/dashboard/submissions/${submissionId}/edit`);
  revalidatePath("/dashboard/submissions");
}
