"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm } from "@/app/contact/actions";
import { SubmitButton } from "@/components/ui/submit-button";

export function ContactForm({
  error,
  success,
}: {
  error?: string | null;
  success?: string | null;
}) {
  if (success) {
    return (
      <div className="rounded-lg border bg-muted/50 p-6 text-center">
        <p className="font-medium text-primary">Message sent successfully.</p>
        <p className="text-muted-foreground mt-1 text-sm">
          We&apos;ll get back to you as soon as we can.
        </p>
      </div>
    );
  }

  return (
    <form action={submitContactForm} className="mt-10 space-y-6">
      {error && (
        <p className="bg-destructive/10 text-destructive rounded-md px-3 py-2 text-sm" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name *</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name *</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            autoComplete="family-name"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" autoComplete="country-name" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          className="resize-none"
        />
      </div>
      <SubmitButton type="submit" pendingText="Sending message...">
        Send message
      </SubmitButton>
    </form>
  );
}
