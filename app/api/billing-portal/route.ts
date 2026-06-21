import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const current = await getCurrentFamily();

  if (!current) {
    return NextResponse.json({ error: "Please sign in and complete onboarding first." }, { status: 401 });
  }

  if (current.family.owner_id !== current.userId) {
    return NextResponse.json({ error: "Only the workspace owner can manage the subscription." }, { status: 403 });
  }

  if (!current.family.stripe_customer_id) {
    return NextResponse.json({ error: "There is no paid subscription to manage yet." }, { status: 404 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";

  if (!stripe) {
    return NextResponse.json({ error: "Stripe billing is not configured yet." }, { status: 503 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: current.family.stripe_customer_id,
      return_url: `${appUrl}/app/settings`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe billing portal session failed", {
      familyId: current.family.id,
      error: error instanceof Error ? error.message : error
    });

    return NextResponse.json({ error: "Billing settings are temporarily unavailable. Please try again shortly." }, { status: 502 });
  }
}
