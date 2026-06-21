import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcceptInviteForm } from "@/components/accept-invite-form";
import { PublicShell } from "@/components/site-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Accept Invite",
  description: "Accept a LioraBump family workspace invite.",
  robots: { index: false, follow: false }
};

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const admin = createAdminClient();
  const { data: invite } = await admin
    .from("partner_invites")
    .select("id,family_id,invited_email,status")
    .eq("id", token)
    .maybeSingle();

  if (!invite) notFound();

  const { data: family } = await admin
    .from("families")
    .select("baby_nickname")
    .eq("id", invite.family_id)
    .maybeSingle();

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const invitedEmail = invite.invited_email;
  const isSignedIn = Boolean(user?.email);
  const isCorrectEmail = user?.email?.toLowerCase() === invitedEmail.toLowerCase();
  const familyName = family?.baby_nickname ?? "this family";

  return (
    <PublicShell>
      <main className="section-pad bg-mist">
        <section className="container-page max-w-2xl">
          <div className="card p-6 md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-coral">Family invite</p>
            <h1 className="mt-4 font-serif text-5xl font-bold text-navy">Join {familyName}&apos;s LioraBump workspace.</h1>
            <p className="mt-5 text-lg leading-8 text-slate">
              This invite is for <strong>{invitedEmail}</strong>. You need to sign in with that email before accepting.
            </p>

            {invite.status !== "pending" ? (
              <p className="mt-6 rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">
                This invite has already been used or cancelled.
              </p>
            ) : !isSignedIn ? (
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/login?next=/invite/${invite.id}`} className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                  Sign in
                </Link>
                <Link href={`/signup?next=/invite/${invite.id}`} className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                  Create account
                </Link>
              </div>
            ) : isCorrectEmail ? (
              <AcceptInviteForm inviteId={invite.id} />
            ) : (
              <p className="mt-6 rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">
                You are signed in as {user?.email}. Sign out and use {invitedEmail} to accept this invite.
              </p>
            )}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}
