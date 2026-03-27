import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function DemoReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Report archive</h1>
      <p className="text-muted-foreground">
        Your completed performance reviews and reports.
      </p>
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            No completed reports yet. When your submissions are reviewed,
            they will appear here.
          </p>
          <Link
            href="/demo/submissions"
            className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
          >
            View submissions
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
