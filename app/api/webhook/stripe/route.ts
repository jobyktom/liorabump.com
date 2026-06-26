import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await syncCheckoutSession(session);
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscription(subscription, event.type === "customer.subscription.deleted");
      break;
    }
    case "invoice.payment_succeeded":
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function syncCheckoutSession(session: Stripe.Checkout.Session) {
  const familyId = session.metadata?.familyId;
  const planId = session.metadata?.planId;

  if (!familyId || !planId) return;

  await getPrisma().family.updateMany({
    where: { id: familyId },
    data: {
      subscriptionPlan: planId,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : null
    }
  });
}

async function syncSubscription(subscription: Stripe.Subscription, isDeleted: boolean) {
  const familyId = subscription.metadata.familyId;
  const planId = subscription.metadata.planId;
  const activeStatuses = ["active", "trialing", "past_due"];
  const nextPlan = !isDeleted && activeStatuses.includes(subscription.status) && planId ? planId : "free";
  const data = {
    subscriptionPlan: nextPlan,
    stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : null,
    stripeSubscriptionId: subscription.id
  };
  const prisma = getPrisma();

  if (familyId) {
    await prisma.family.updateMany({ where: { id: familyId }, data });
    return;
  }

  await prisma.family.updateMany({ where: { stripeSubscriptionId: subscription.id }, data });
}
