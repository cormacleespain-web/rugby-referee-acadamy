import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSubmissionVideo } from "../../actions";
import { createCheckoutSession } from "../../stripe-actions";

export default async function EditSubmissionPage({
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
    .select({
      id: submissions.id,
      userId: submissions.userId,
      status: submissions.status,
      videoUrl: submissions.videoUrl,
      serviceId: submissions.serviceId,
    })
    .from(submissions)
    .where(eq(submissions.id, id))
    .limit(1);

  if (!sub || sub.userId !== user.id) notFound();
  if (sub.status !== "draft") redirect(`/dashboard/submissions/${id}`);

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.id, sub.serviceId))
    .limit(1);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add match footage</h1>
        <p className="text-muted-foreground mt-1">
          {service?.name ?? "Submission"} — paste a link to your match video
          (YouTube, Vimeo, Google Drive, Hudl, etc.).
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Video link</CardTitle>
          <CardDescription>
            Provide a URL to your match footage. The reviewer will use this to
            analyse your performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={updateSubmissionVideo.bind(null, id)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://..."
                defaultValue={sub.videoUrl ?? ""}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit">Save</Button>
              <Link
                href={`/dashboard/submissions/${id}`}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                View submission
              </Link>
            </div>
          </form>
          {sub.videoUrl && (
            <form action={createCheckoutSession.bind(null, id)} className="mt-3">
              <Button type="submit">Proceed to payment</Button>
            </form>
          )}
        </CardContent>
      </Card>
      <Link
        href="/dashboard/submissions"
        className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        Back to submissions
      </Link>
    </div>
  );
}
