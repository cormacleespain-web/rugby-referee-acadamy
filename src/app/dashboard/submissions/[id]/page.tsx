import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services, reports } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCheckoutSession } from "../stripe-actions";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  payment_pending: "Payment pending",
  paid: "Paid",
  assigned: "Assigned to coach",
  in_review: "In review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function SubmissionDetailPage({
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

  if (!sub || sub.userId !== user.id) notFound();

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, sub.serviceId))
    .limit(1);

  const [report] = sub.status === "completed"
    ? await db
        .select()
        .from(reports)
        .where(eq(reports.submissionId, sub.id))
        .limit(1)
    : [];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Submission details</h1>
          <p className="text-muted-foreground text-sm">
            Created {new Date(sub.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/dashboard/submissions"
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Back to list
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status</CardTitle>
            <Badge>{statusLabels[sub.status] ?? sub.status}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Service: {service?.name ?? sub.serviceId}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {sub.videoUrl && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">Video link</p>
              <a
                href={sub.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline"
              >
                {sub.videoUrl}
              </a>
            </div>
          )}
          {sub.status === "draft" && (
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dashboard/submissions/${id}/edit`}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Edit / Add video link
              </Link>
              {sub.videoUrl && (
                <form action={createCheckoutSession.bind(null, id)}>
                  <Button type="submit">Proceed to payment</Button>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Your report</CardTitle>
            <p className="text-muted-foreground text-sm">
              Published {report.publishedAt ? new Date(report.publishedAt).toLocaleDateString() : ""}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            {report.feedback && (
              <div className="space-y-2">
                <h3 className="font-medium">Feedback</h3>
                <div className="text-muted-foreground whitespace-pre-wrap">
                  {report.feedback}
                </div>
              </div>
            )}
            {report.performanceInsights && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium">Performance insights</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {report.performanceInsights}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
