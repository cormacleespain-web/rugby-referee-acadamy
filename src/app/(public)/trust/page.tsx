export const metadata = {
  title: "Trust & Safeguarding | Rugby Refereeing Academy",
};

export default function TrustPage() {
  return (
    <div className="container px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Trust & Safeguarding
        </h1>
        <p className="text-muted-foreground">
          We operate a professional review workflow built for transparency,
          fair coaching standards, and responsible handling of referee footage.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Review integrity</h2>
          <p className="text-muted-foreground">
            Coaches are assigned through role-based workflows and every report is
            tied to a submission and reviewer identity.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Payment security</h2>
          <p className="text-muted-foreground">
            Card payments are handled through Stripe. We validate payment events
            before marking submissions as paid.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Youth development commitment</h2>
          <p className="text-muted-foreground">
            A portion of platform activity supports youth referee initiatives and
            long-term pathway development.
          </p>
        </section>
      </div>
    </div>
  );
}
