import Link from "next/link";
import { getDb } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSubmission } from "../actions";

export default async function NewSubmissionPage() {
  let serviceList: { id: string; slug: string; name: string; description: string | null }[] = [];
  try {
    const db = getDb();
    serviceList = await db.select().from(services);
  } catch {
    // DB not available
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New performance review</h1>
        <p className="text-muted-foreground mt-1">
          Choose a service to get started.
        </p>
      </div>
      <div className="grid gap-4">
        {serviceList.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No services available. Please try again later.</p>
              <Link
                href="/dashboard/submissions"
                className="mt-4 inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Back to submissions
              </Link>
            </CardContent>
          </Card>
        ) : (
          serviceList.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                {service.description && (
                  <CardDescription>{service.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <form action={createSubmission.bind(null, service.slug)}>
                  <Button type="submit">Select {service.name}</Button>
                </form>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Link
        href="/dashboard/submissions"
        className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        Cancel
      </Link>
    </div>
  );
}
