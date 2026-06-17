export const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: "£0",
    interval: "",
    stripePriceEnv: null,
    items: ["Pregnancy week tracker", "Basic food and exercise guides", "Journal notes", "Selected baby milestones"]
  },
  {
    id: "premium",
    name: "Premium",
    price: "£6.99",
    interval: "/mo",
    stripePriceEnv: "STRIPE_PREMIUM_PRICE_ID",
    items: ["Full health tracker", "Scan and document uploads", "Memory album export", "Kick counter and contraction timer"]
  },
  {
    id: "family",
    name: "Family",
    price: "£9.99",
    interval: "/mo",
    stripePriceEnv: "STRIPE_FAMILY_PRICE_ID",
    items: ["Partner and family viewer access", "Shared checklists", "Private album sharing", "Priority export tools"]
  }
] as const;

export type PricingPlanId = (typeof pricingPlans)[number]["id"];

export function getPlan(planId: string) {
  return pricingPlans.find((plan) => plan.id === planId);
}
