import Link from "next/link";
import { getDb } from "@/lib/db";
import { pricing, services } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  let performanceReview: InferSelectModel<typeof services>[] = [];
  let coaching: InferSelectModel<typeof services>[] = [];
  let defaultPricing: InferSelectModel<typeof pricing>[] = [];
  try {
    const db = getDb();
    performanceReview = await db
      .select()
      .from(services)
      .where(eq(services.slug, "performance_review"))
      .limit(1);
    coaching = await db
      .select()
      .from(services)
      .where(eq(services.slug, "coaching"))
      .limit(1);
    defaultPricing = await db.select().from(pricing).where(eq(pricing.region, "default"));
  } catch {
    // DB not available
  }

  const getPrice = (serviceId: string) =>
    defaultPricing.find((p) => p.serviceId === serviceId);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: currency || "EUR",
    }).format(cents / 100);
  };

  return (
    <div className="container px-4 py-14 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Pricing</h1>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
        Choose the service that fits your development goals. Pricing may vary by
        region.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {performanceReview[0] && (
          <Card>
            <CardHeader>
              <CardTitle>{performanceReview[0].name}</CardTitle>
              <CardDescription>
                {performanceReview[0].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getPrice(performanceReview[0].id) ? (
                <p className="text-2xl font-semibold">
                  {formatPrice(
                    getPrice(performanceReview[0].id)!.amountCents,
                    getPrice(performanceReview[0].id)!.currency
                  )}
                </p>
              ) : (
                <p className="text-muted-foreground">Price on request</p>
              )}
            </CardContent>
            <CardFooter>
              <Link
                href="/signup"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>
            </CardFooter>
          </Card>
        )}
        {coaching[0] && (
          <Card>
            <CardHeader>
              <CardTitle>{coaching[0].name}</CardTitle>
              <CardDescription>{coaching[0].description}</CardDescription>
            </CardHeader>
            <CardContent>
              {getPrice(coaching[0].id) ? (
                <p className="text-2xl font-semibold">
                  {formatPrice(
                    getPrice(coaching[0].id)!.amountCents,
                    getPrice(coaching[0].id)!.currency
                  )}
                </p>
              ) : (
                <p className="text-muted-foreground">Price on request</p>
              )}
            </CardContent>
            <CardFooter>
              <Link
                href="/signup"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get started
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
      {!performanceReview[0] && !coaching[0] && (
        <p className="text-muted-foreground py-12 text-center">
          Pricing information will be available soon. Contact us for details.
        </p>
      )}
    </div>
  );
}
