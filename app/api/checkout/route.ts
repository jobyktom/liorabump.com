import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { getPlan } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { planId } = (await req.json()) as { planId?: string };
  const plan = planId ? getPlan(planId) : null;

  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  if (plan.id === "free") {
    return NextResponse.json({ url: "/app/onboarding" });
  }

  const current = await getCurrentFamily();

  if (!current) {
    return NextResponse.json({ error: "Please sign in and complete onboarding before choosing a paid plan." }, { status: 401 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const priceId = plan.stripePriceEnv ? process.env[plan.stripePriceEnv] : null;

  if (!stripe || !priceId) {
    return NextResponse.json(
      {
        error: "Stripe is not configured yet.",
        missing: [
          !stripe ? "STRIPE_SECRET_KEY" : null,
          !process.env.NEXT_PUBLIC_APP_URL ? "NEXT_PUBLIC_APP_URL" : null,
          !priceId && plan.stripePriceEnv ? plan.stripePriceEnv : null
        ].filter(Boolean)
      },
      { status: 503 }
    );
  }

  const existingSubscriptionId = current.family.stripe_subscription_id;

  if (existingSubscriptionId) {
    try {
      const subscription = await stripe.subscriptions.retrieve(existingSubscriptionId);

      if (["active", "trialing", "past_due"].includes(subscription.status)) {
        const subscriptionItem = subscription.items.data[0];

        if (!subscriptionItem) {
          return NextResponse.json({ error: "Your current subscription could not be updated. Please contact support." }, { status: 409 });
        }

        if (subscriptionItem.price.id === priceId) {
          return NextResponse.json({ url: `${appUrl}/pricing/success?plan=${plan.id}` });
        }

        await stripe.subscriptions.update(existingSubscriptionId, {
          items: [{ id: subscriptionItem.id, price: priceId }],
          metadata: {
            planId: plan.id,
            familyId: current.family.id,
            userId: current.userId
          },
          proration_behavior: "create_prorations"
        });

        return NextResponse.json({ url: `${appUrl}/pricing/success?plan=${plan.id}` });
      }
    } catch {
      return NextResponse.json(
        { error: "We could not verify your current subscription. Please contact support before changing plans." },
        { status: 409 }
      );
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: current.email,
    client_reference_id: current.family.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/pricing/cancelled`,
    allow_promotion_codes: true,
    metadata: {
      planId: plan.id,
      familyId: current.family.id,
      userId: current.userId
    },
    subscription_data: {
      metadata: {
        planId: plan.id,
        familyId: current.family.id,
        userId: current.userId
      }
    }
  });

  return NextResponse.json({ url: session.url });
}
