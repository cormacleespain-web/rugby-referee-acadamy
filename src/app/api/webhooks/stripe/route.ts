import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { submissions, payments, pricing } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const submissionId = session.metadata?.submissionId;
    if (!submissionId) {
      return NextResponse.json({ error: "Missing submissionId in metadata" }, { status: 400 });
    }

    const db = getDb();
    const [sub] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);
    if (!sub) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    if (sub.stripeCheckoutSessionId && sub.stripeCheckoutSessionId !== session.id) {
      return NextResponse.json({ error: "Checkout session mismatch" }, { status: 400 });
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
    if (paymentIntentId) {
      const [existing] = await db
        .select({ id: payments.id })
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, paymentIntentId))
        .limit(1);
      if (existing) {
        return NextResponse.json({ received: true });
      }
    }

    const amountTotal = session.amount_total ?? 0;
    const [priceRow] = await db
      .select({ amountCents: pricing.amountCents, currency: pricing.currency })
      .from(pricing)
      .where(and(eq(pricing.serviceId, sub.serviceId), eq(pricing.active, true)))
      .limit(1);

    if (
      !priceRow ||
      amountTotal !== priceRow.amountCents ||
      (session.currency ?? "eur").toUpperCase() !== priceRow.currency.toUpperCase()
    ) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    await db
      .update(submissions)
      .set({
        status: "paid",
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId));

    await db.insert(payments).values({
      submissionId,
      userId: sub.userId,
      stripePaymentIntentId: paymentIntentId,
      amountCents: amountTotal,
      currency: (session.currency ?? "eur").toUpperCase(),
      status: "succeeded",
    });
  }

  return NextResponse.json({ received: true });
}
