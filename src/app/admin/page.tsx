import Link from "next/link";
import { getDb } from "@/lib/db";
import { submissions, profiles } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  let stats = {
    totalSubmissions: 0,
    paidCount: 0,
    completedCount: 0,
    coachCount: 0,
  };
  try {
    const db = getDb();
    const [subCount] = await db.select({ value: count() }).from(submissions);
    const [paid] = await db
      .select({ value: count() })
      .from(submissions)
      .where(eq(submissions.status, "paid"));
    const [completed] = await db
      .select({ value: count() })
      .from(submissions)
      .where(eq(submissions.status, "completed"));
    const [coaches] = await db
      .select({ value: count() })
      .from(profiles)
      .where(eq(profiles.role, "coach"));

    stats = {
      totalSubmissions: Number(subCount?.value ?? 0),
      paidCount: Number(paid?.value ?? 0),
      completedCount: Number(completed?.value ?? 0),
      coachCount: Number(coaches?.value ?? 0),
    };
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <p className="text-muted-foreground">
        Overview and management of the platform.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid (awaiting assignment)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.paidCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.completedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coaches</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.coachCount}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href="/admin/submissions"
            className="text-primary text-sm font-medium hover:underline"
          >
            Manage submissions and assign coaches
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
