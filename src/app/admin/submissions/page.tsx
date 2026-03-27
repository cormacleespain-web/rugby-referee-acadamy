import { getDb } from "@/lib/db";
import { submissions, services, profiles } from "@/lib/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignCoachForm } from "./assign-coach-form";

export default async function AdminSubmissionsPage() {
  const list: {
    id: string;
    status: string;
    createdAt: Date;
    serviceName: string;
    userEmail: string | null;
    assignedCoachEmail: string | null;
  }[] = [];
  let coaches: { id: string; email: string | null; fullName: string | null }[] = [];
  try {
    const db = getDb();
    coaches = await db
      .select({ id: profiles.id, email: profiles.email, fullName: profiles.fullName })
      .from(profiles)
      .where(eq(profiles.role, "coach"));

    const rows = await db
      .select({
        id: submissions.id,
        status: submissions.status,
        createdAt: submissions.createdAt,
        assignedCoachId: submissions.assignedCoachId,
        serviceName: services.name,
        userId: submissions.userId,
      })
      .from(submissions)
      .innerJoin(services, eq(submissions.serviceId, services.id))
      .orderBy(desc(submissions.createdAt))
      .limit(100);

    const profileIds = Array.from(
      new Set(
        rows.flatMap((r) =>
          r.assignedCoachId ? [r.userId, r.assignedCoachId] : [r.userId]
        )
      )
    );
    const profileRows =
      profileIds.length > 0
        ? await db
            .select({ id: profiles.id, email: profiles.email })
            .from(profiles)
            .where(inArray(profiles.id, profileIds))
        : [];
    const profileMap = new Map(profileRows.map((p) => [p.id, p.email]));

    for (const r of rows) {
      list.push({
        id: r.id,
        status: r.status,
        createdAt: r.createdAt,
        serviceName: r.serviceName,
        userEmail: profileMap.get(r.userId) ?? null,
        assignedCoachEmail: r.assignedCoachId ? profileMap.get(r.assignedCoachId) ?? null : null,
      });
    }
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Submissions</h1>
      <p className="text-muted-foreground">
        View all submissions and assign coaches to paid orders.
      </p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Referee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              list.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {new Date(s.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{s.serviceName}</TableCell>
                  <TableCell>{s.userEmail ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{s.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>{s.assignedCoachEmail ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {s.status === "paid" && (
                      <AssignCoachForm submissionId={s.id} coaches={coaches} />
                    )}
                    {s.status !== "paid" && (
                      <span className="text-muted-foreground text-sm">Awaiting payment</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
