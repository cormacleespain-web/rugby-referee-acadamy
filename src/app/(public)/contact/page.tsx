import { ContactForm } from "./contact-form";

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  return (
    <div className="container max-w-2xl px-4 py-14 sm:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact us</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Have a question or want to get in touch? Use the form below or reach out
        via our social channels.
      </p>
      <ContactForm error={error} success={success} />
    </div>
  );
}
