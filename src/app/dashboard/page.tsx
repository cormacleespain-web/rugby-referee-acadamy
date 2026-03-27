import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let userSubmissions: { id: string; status: string; createdAt: Date }[] = [];
  try {
    const db = getDb();
    userSubmissions = await db
      .select({ id: submissions.id, status: submissions.status, createdAt: submissions.createdAt })
      .from(submissions)
      .where(eq(submissions.userId, user.id))
      .orderBy(desc(submissions.createdAt))
      .limit(5);
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your performance reviews and view reports
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New submission</CardTitle>
            <CardDescription>
              Submit match footage for professional review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/submissions/new" className={buttonVariants()}>
              Start new request
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent submissions</CardTitle>
            <CardDescription>
              Your latest performance review requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userSubmissions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No submissions yet. Start your first review request.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {userSubmissions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/dashboard/submissions/${s.id}`}
                      className="hover:underline"
                    >
                      {s.status} — {new Date(s.createdAt).toLocaleDateString()}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
