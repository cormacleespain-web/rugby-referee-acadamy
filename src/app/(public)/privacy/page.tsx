export const metadata = {
  title: "Privacy | Rugby Refereeing Academy",
};

export default function PrivacyPage() {
  return (
    <div className="container px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We collect only the information required to run referee reviews,
          process payments, and communicate about your submissions. We do not
          sell personal data.
        </p>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">What we collect</h2>
          <p className="text-muted-foreground">
            Account details, submission details, video links you provide,
            payment confirmations, and support messages.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">How we use it</h2>
          <p className="text-muted-foreground">
            To deliver review services, manage coach assignments, provide
            reports, and improve service quality.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Your rights</h2>
          <p className="text-muted-foreground">
            You can request access, correction, or deletion of your account data
            by contacting us via the contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
