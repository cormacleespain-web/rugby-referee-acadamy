import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
  paid: "default",
  completed: "default",
};

export default function DemoSubmissionsPage() {
  const mockSubmissions = [
    { id: "1", date: "2025-03-01", service: "Performance Review", status: "completed" },
    { id: "2", date: "2025-03-05", service: "Performance Review", status: "draft" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Submissions</h1>
        <Link
          href="/demo"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start new request
        </Link>
      </div>
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
            {mockSubmissions.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.service}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[s.status] ?? "secondary"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={s.status === "completed" ? "/demo/reports" : "/demo"}
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
    </div>
  );
}
