import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportForm } from "./report-form";

export default async function CoachReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [sub] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!sub || sub.assignedCoachId !== user.id) notFound();
  if (sub.status !== "assigned" && sub.status !== "in_review")
    redirect("/coach");

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, sub.serviceId))
    .limit(1);

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Review submission</h1>
      <Card>
        <CardHeader>
          <CardTitle>Match footage</CardTitle>
          <p className="text-muted-foreground text-sm">
            Service: {service?.name ?? sub.serviceId}
          </p>
        </CardHeader>
        <CardContent>
          {sub.videoUrl ? (
            <div className="space-y-2">
              <a
                href={sub.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                Open video: {sub.videoUrl}
              </a>
              <p className="text-muted-foreground text-xs">
                Open in a new tab to watch while completing the report.
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No video link provided.</p>
          )}
          {sub.selfReview != null && typeof sub.selfReview === "object" && (
            <div className="mt-4 rounded border p-4">
              <h3 className="font-medium text-sm">Self-review (from referee)</h3>
              <pre className="text-muted-foreground mt-2 whitespace-pre-wrap text-sm">
                {JSON.stringify(sub.selfReview as Record<string, unknown>, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
      <ReportForm submissionId={id} />
    </div>
  );
}
