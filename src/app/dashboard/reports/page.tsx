import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const completed = await db
    .select({
      id: submissions.id,
      createdAt: submissions.createdAt,
      completedAt: submissions.completedAt,
      serviceName: services.name,
    })
    .from(submissions)
    .innerJoin(services, eq(submissions.serviceId, services.id))
    .where(eq(submissions.userId, user.id))
    .orderBy(desc(submissions.completedAt));

  const completedWithReports = completed.filter((s) => s.completedAt != null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Report archive</h1>
      <p className="text-muted-foreground">
        Your completed performance reviews and reports.
      </p>
      {completedWithReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No completed reports yet. When your submissions are reviewed,
              they will appear here.
            </p>
            <Link
              href="/dashboard/submissions"
              className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
            >
              View submissions
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {completedWithReports.map((s) => (
            <Link key={s.id} href={`/dashboard/submissions/${s.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{s.serviceName}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Completed{" "}
                    {s.completedAt
                      ? new Date(s.completedAt).toLocaleDateString()
                      : ""}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
