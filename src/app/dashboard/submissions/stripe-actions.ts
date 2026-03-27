"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getDb } from "@/lib/db";
import { submissions, pricing } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function createCheckoutSession(submissionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = getDb();
  const [sub] = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1);
  if (!sub || sub.userId !== user.id || sub.status !== "draft")
    redirect("/dashboard/submissions");

  if (!sub.videoUrl)
    redirect(`/dashboard/submissions/${submissionId}/edit?error=Add+video+link+first`);

  const [priceRow] = await db
    .select()
    .from(pricing)
    .where(eq(pricing.serviceId, sub.serviceId))
    .limit(1);
  if (!priceRow || !priceRow.active)
    redirect("/dashboard/submissions?error=Pricing+not+available");

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: priceRow.currency.toLowerCase(),
          unit_amount: priceRow.amountCents,
          product_data: {
            name: "Performance Review",
            description: "Professional match review and feedback",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { submissionId },
    success_url: `${origin}/dashboard/submissions/${submissionId}?status=success`,
    cancel_url: `${origin}/dashboard/submissions/${submissionId}`,
    customer_email: user.email ?? undefined,
  });

  await db
    .update(submissions)
    .set({
      status: "payment_pending",
      stripeCheckoutSessionId: session.id,
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId));

  if (session.url) redirect(session.url);
  redirect("/dashboard/submissions?error=Checkout+failed");
}
