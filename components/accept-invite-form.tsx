"use client";

import { useActionState } from "react";
import { acceptInvite } from "@/app/actions/invites";

export function AcceptInviteForm({ inviteId }: { inviteId: string }) {
  const [state, formAction, pending] = useActionState(acceptInvite, { ok: false, message: "" });

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <input type="hidden" name="invite_id" value={inviteId} />
      <button disabled={pending} className="h-14 rounded-2xl bg-navy px-6 text-sm font-bold text-white disabled:opacity-60">
        {pending ? "Accepting..." : "Accept invite"}
      </button>
      {state.message ? <p className="rounded-2xl bg-peach/70 p-4 text-sm font-semibold leading-6 text-navy">{state.message}</p> : null}
    </form>
  );
}
