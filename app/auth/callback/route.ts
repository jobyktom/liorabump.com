import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const requestedNext = requestUrl.searchParams.get("next");
  const next = requestedNext?.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/app/onboarding";

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
