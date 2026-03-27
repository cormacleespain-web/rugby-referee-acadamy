import { getDb } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminCoachesPage() {
  let list: { id: string; email: string; fullName: string | null; country: string | null }[] = [];
  try {
    const db = getDb();
    list = await db
      .select({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
        country: profiles.country,
      })
      .from(profiles)
      .where(eq(profiles.role, "coach"))
      .orderBy(desc(profiles.createdAt));
  } catch {
    // DB not available
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Coaches</h1>
      <p className="text-muted-foreground">
        Coaches who can be assigned to review submissions.
      </p>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground text-center">
                  No coaches found. Update user roles in the database to add coaches.
                </TableCell>
              </TableRow>
            ) : (
              list.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.fullName ?? "—"}</TableCell>
                  <TableCell>{c.country ?? "—"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
