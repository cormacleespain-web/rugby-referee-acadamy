export const metadata = {
  title: "Terms | Rugby Refereeing Academy",
};

export default function TermsPage() {
  return (
    <div className="container px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="text-muted-foreground">
          By using this service, you agree to provide accurate submission
          details, maintain account security, and use the platform lawfully.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Service scope</h2>
          <p className="text-muted-foreground">
            Reviews are educational coaching outputs based on the footage and
            context you provide.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Payments and refunds</h2>
          <p className="text-muted-foreground">
            Payments are processed securely by Stripe. Refund requests are
            reviewed case-by-case, especially when delivery has not started.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Contact</h2>
          <p className="text-muted-foreground">
            For account or billing support, use the contact page and include the
            submission reference where possible.
          </p>
        </section>
      </div>
    </div>
  );
}
