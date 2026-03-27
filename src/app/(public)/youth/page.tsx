import { getDb } from "@/lib/db";
import { youthInitiatives } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonateSection } from "@/components/home/donate-section";
import youthImage from "../../../../images/image 2.jpeg";

export default async function YouthPage() {
  let initiatives: InferSelectModel<typeof youthInitiatives>[] = [];
  try {
    const db = getDb();
    initiatives = await db
      .select()
      .from(youthInitiatives)
      .where(eq(youthInitiatives.published, true));
  } catch {
    // DB not available
  }

  return (
    <>
      <div className="container px-4 py-14 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Youth referee development</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          A portion of Referee Academy revenue supports youth referee initiatives
          and development programmes. We are committed to growing the next
          generation of referees.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border">
          <Image
            src={youthImage}
            alt="Youth referee development session"
            className="h-auto w-full object-cover"
            priority
          />
        </div>
        <div className="mt-10 space-y-8">
          {initiatives.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-muted-foreground text-center">
                  We will share details of our youth initiatives and programmes
                  here soon. Get in touch if you would like to get involved.
                </p>
              </CardContent>
            </Card>
          ) : (
            initiatives.map((initiative) => (
              <Card key={initiative.id}>
                <CardHeader>
                  <CardTitle>{initiative.title}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                  {initiative.content ? (
                    <p className="whitespace-pre-line">{initiative.content}</p>
                  ) : (
                    <p className="text-muted-foreground">More details coming soon.</p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <DonateSection />
    </>
  );
}
