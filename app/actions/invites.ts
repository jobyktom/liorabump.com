"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type InviteAcceptState = {
  ok: boolean;
  message: string;
};

export async function acceptInvite(_state: InviteAcceptState, formData: FormData): Promise<InviteAcceptState> {
  const inviteId = String(formData.get("invite_id") ?? "");
  if (!inviteId) return { ok: false, message: "Invite link is missing." };

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, message: "Please sign in or create an account with the invited email before accepting." };
  }

  const admin = createAdminClient();
  const { data: invite, error: inviteError } = await admin
    .from("partner_invites")
    .select("id,family_id,invited_email,status")
    .eq("id", inviteId)
    .maybeSingle();

  if (inviteError || !invite) {
    return { ok: false, message: "This invite link is not valid." };
  }

  if (invite.status !== "pending") {
    return { ok: false, message: "This invite has already been used or cancelled." };
  }

  if (invite.invited_email.toLowerCase() !== user.email.toLowerCase()) {
    return {
      ok: false,
      message: `This invite is for ${invite.invited_email}. Please sign in with that email address.`
    };
  }

  await admin.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null,
    role: "partner",
    country: null
  });

  const { error: memberError } = await admin.from("family_members").upsert({
    family_id: invite.family_id,
    profile_id: user.id,
    member_role: "partner",
    consent_granted_at: new Date().toISOString()
  });

  if (memberError) {
    return { ok: false, message: memberError.message };
  }

  await admin.from("partner_invites").update({ status: "accepted" }).eq("id", invite.id);
  redirect("/app");
}
