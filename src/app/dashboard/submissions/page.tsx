import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { submissions, services } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "outline",
  submitted: "secondary",
  payment_pending: "secondary",
  paid: "default",
  assigned: "default",
  in_review: "default",
  completed: "default",
  cancelled: "destructive",
};

export default async function SubmissionsListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const userSubmissions = await db
    .select({
      id: submissions.id,
      status: submissions.status,
      createdAt: submissions.createdAt,
      serviceName: services.name,
    })
    .from(submissions)
    .innerJoin(services, eq(submissions.serviceId, services.id))
    .where(eq(submissions.userId, user.id))
    .orderBy(desc(submissions.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Submissions</h1>
        <Link href="/dashboard/submissions/new" className={buttonVariants()}>
          New submission
        </Link>
      </div>
      {userSubmissions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">No submissions yet.</p>
          <Link
            href="/dashboard/submissions/new"
            className={`${buttonVariants()} mt-4`}
          >
            Start your first review
          </Link>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userSubmissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{s.serviceName}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[s.status] ?? "secondary"}>
                      {s.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/dashboard/submissions/${s.id}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      View
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
