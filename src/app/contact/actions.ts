"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { getDb } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "onboarding@resend.dev";

export async function submitContactForm(formData: FormData) {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const country = (formData.get("country") as string)?.trim() || null;
  const subject = (formData.get("subject") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!firstName || !lastName || !email || !subject || !message) {
    redirect("/contact?error=" + encodeURIComponent("Please fill in all required fields."));
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/contact?error=" + encodeURIComponent("Please enter a valid email address."));
  }

  try {
    if (process.env.DATABASE_URL) {
      const db = getDb();
      await db.insert(contactMessages).values({
        firstName,
        lastName,
        email,
        country,
        subject,
        message,
      });
    }
  } catch {
    // Continue to send email even if DB insert fails
  }

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[Referee Academy Contact] ${subject}`,
      text: `From: ${firstName} ${lastName} <${email}>${country ? `\nCountry: ${country}` : ""}\n\nSubject: ${subject}\n\n${message}`,
    });
    if (error) redirect("/contact?error=" + encodeURIComponent(error.message));
  } catch {
    redirect("/contact?error=" + encodeURIComponent("Failed to send message. Please try again later."));
  }

  redirect("/contact?success=1");
}
