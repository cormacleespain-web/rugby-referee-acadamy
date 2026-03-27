import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CoachDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const assigned = await db
    .select({
      id: submissions.id,
      status: submissions.status,
      videoUrl: submissions.videoUrl,
      createdAt: submissions.createdAt,
      serviceName: services.name,
    })
    .from(submissions)
    .innerJoin(services, eq(submissions.serviceId, services.id))
    .where(eq(submissions.assignedCoachId, user.id))
    .orderBy(desc(submissions.createdAt));

  const inProgress = assigned.filter(
    (s) => s.status === "assigned" || s.status === "in_review"
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Coach dashboard</h1>
      <p className="text-muted-foreground">
        Submissions assigned to you for review.
      </p>
      {inProgress.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No reviews assigned at the moment.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inProgress.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{s.serviceName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/coach/reviews/${s.id}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Review
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
