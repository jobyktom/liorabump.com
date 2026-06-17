import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import {
  cancelFamilyInvite,
  createFamilyInvite,
  deleteWorkspaceData,
  removeFamilyMember,
  updateAccountSettings
} from "@/app/actions/settings";
import { CopyInviteLink } from "@/components/copy-invite-link";
import { PublicShell } from "@/components/site-shell";
import { MedicalNotice } from "@/components/ui";
import { inviteUrl } from "@/lib/invites";
import { getSettingsData } from "@/lib/settings-data";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your LioraBump account, family workspace, privacy, export and deletion settings."
};

export default async function SettingsPage() {
  const settings = await getSettingsData();

  return (
    <PublicShell>
      <main className="section-pad bg-mist">
        <section className="container-page">
          <Link href="/app" className="text-sm font-bold text-coral">
            Back to dashboard
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-lavender text-navy">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h1 className="mt-5 font-serif text-5xl font-bold text-navy">Settings</h1>
              <p className="mt-5 text-lg leading-8 text-slate">
                Manage account details, your family workspace, privacy controls, export and deletion.
              </p>
              <div className="mt-8">
                <MedicalNotice />
              </div>
            </div>

            {settings ? (
              <div className="grid gap-6">
                <form action={updateAccountSettings} className="card p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-coral">Account and journey</p>
                      <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Profile details</h2>
                    </div>
                    <span className="rounded-full bg-peach px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                      {settings.current.family.subscription_plan} plan
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <TextField name="full_name" label="Full name" defaultValue={settings.profile?.full_name ?? ""} />
                    <TextField name="country" label="Country" defaultValue={settings.profile?.country ?? settings.current.family.country ?? ""} />
                    <label className="grid gap-2 text-sm font-bold text-navy">
                      Role
                      <select
                        name="role"
                        defaultValue={settings.profile?.role ?? "mother"}
                        className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
                      >
                        <option value="mother">Mother</option>
                        <option value="partner">Partner</option>
                        <option value="family_viewer">Family viewer</option>
                      </select>
                    </label>
                    <TextField
                      name="baby_nickname"
                      label="Baby nickname"
                      defaultValue={settings.current.family.baby_nickname}
                      disabled={!settings.isOwner}
                    />
                    <TextField
                      name="due_date"
                      label="Due date"
                      type="date"
                      defaultValue={settings.current.family.due_date ?? ""}
                      disabled={!settings.isOwner}
                    />
                    <label className="grid gap-2 text-sm font-bold text-navy">
                      Privacy level
                      <select
                        name="privacy_level"
                        defaultValue={settings.current.family.privacy_level}
                        disabled={!settings.isOwner}
                        className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep disabled:opacity-60"
                      >
                        <option value="private">Private</option>
                        <option value="partner">Partner</option>
                        <option value="family">Family</option>
                      </select>
                    </label>
                  </div>

                  {!settings.isOwner ? (
                    <p className="mt-4 rounded-2xl bg-peach/70 p-4 text-sm leading-6 text-navy">
                      Only the workspace owner can update baby, due date and privacy settings.
                    </p>
                  ) : null}

                  <button type="submit" className="mt-6 h-14 rounded-2xl bg-navy px-6 text-sm font-bold text-white">
                    Save settings
                  </button>
                </form>

                <section className="grid gap-6 xl:grid-cols-2">
                  <div className="card p-6">
                    <div className="flex items-center gap-3">
                      <UsersRound className="h-6 w-6 text-lavenderDeep" />
                      <h2 className="font-serif text-2xl font-bold text-navy">Family members</h2>
                    </div>
                    <div className="mt-5 grid gap-3">
                      {settings.members.map((member) => (
                        <div key={member.profile_id} className="rounded-2xl bg-background p-4">
                          <p className="text-sm font-bold text-navy">{formatRole(member.member_role)}</p>
                          <p className="mt-1 break-all text-xs text-slate">{member.profile_id}</p>
                          {member.profile_id === settings.current.family.owner_id ? (
                            <p className="mt-2 text-xs font-bold uppercase tracking-wide text-coral">Owner</p>
                          ) : settings.isOwner ? (
                            <form action={removeFamilyMember} className="mt-3">
                              <input type="hidden" name="profile_id" value={member.profile_id} />
                              <button type="submit" className="rounded-xl bg-peach px-4 py-3 text-sm font-bold text-coral">
                                Remove member
                              </button>
                            </form>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-6 w-6 text-lavenderDeep" />
                      <h2 className="font-serif text-2xl font-bold text-navy">Invites</h2>
                    </div>
                    {settings.isOwner ? (
                      <form action={createFamilyInvite} className="mt-5 grid gap-3">
                        <TextField name="invited_email" label="Invite email" type="email" />
                        <button type="submit" className="h-14 rounded-2xl bg-navy px-6 text-sm font-bold text-white">
                          Send invite
                        </button>
                      </form>
                    ) : (
                      <p className="mt-5 rounded-2xl bg-background p-4 text-sm leading-6 text-slate">
                        Only the workspace owner can create or cancel invites.
                      </p>
                    )}
                    <div className="mt-5 grid gap-3">
                      {settings.invites.length ? (
                        settings.invites.map((invite) => (
                          <div key={invite.id} className="rounded-2xl bg-background p-4">
                            <p className="font-bold text-navy">{invite.invited_email}</p>
                            <p className="mt-1 text-sm text-slate">{invite.status}</p>
                            {settings.isOwner ? (
                              <div className="mt-3 grid gap-3">
                                <CopyInviteLink url={inviteUrl(invite.id)} />
                                <form action={cancelFamilyInvite}>
                                  <input type="hidden" name="invite_id" value={invite.id} />
                                  <button type="submit" className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-navy">
                                    Cancel invite
                                  </button>
                                </form>
                              </div>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl bg-background p-4 text-sm leading-6 text-slate">No pending invites.</p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-2">
                  <div className="card p-6">
                    <div className="flex items-center gap-3">
                      <Download className="h-6 w-6 text-lavenderDeep" />
                      <h2 className="font-serif text-2xl font-bold text-navy">Export data</h2>
                    </div>
                    <div className="mt-5 grid gap-3 text-sm leading-6 text-slate">
                      <p>Export includes profile, family, records, media metadata, milestones and invites available to your account.</p>
                      <StatsGrid counts={settings.counts} />
                    </div>
                    <a href="/api/settings/export" className="mt-5 inline-flex h-14 items-center rounded-2xl bg-navy px-6 text-sm font-bold text-white">
                      Download JSON export
                    </a>
                  </div>

                  <div className="card border border-coral/20 p-6">
                    <div className="flex items-center gap-3">
                      <Trash2 className="h-6 w-6 text-coral" />
                      <h2 className="font-serif text-2xl font-bold text-navy">Delete workspace</h2>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-slate">
                      Owner-only deletion removes this family workspace, records and stored files. Type DELETE to confirm.
                    </p>
                    {settings.isOwner ? (
                      <form action={deleteWorkspaceData} className="mt-5 grid gap-3">
                        <TextField name="confirmation" label="Confirmation" />
                        <button type="submit" className="h-14 rounded-2xl bg-coral px-6 text-sm font-bold text-white">
                          Delete workspace data
                        </button>
                      </form>
                    ) : (
                      <p className="mt-5 rounded-2xl bg-background p-4 text-sm leading-6 text-slate">
                        Only the workspace owner can delete workspace data.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            ) : (
              <div className="card p-6 md:p-8">
                <h2 className="font-serif text-3xl font-bold text-navy">Sign in required</h2>
                <p className="mt-4 text-sm leading-6 text-slate">Create an account and complete onboarding before managing settings.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/login" className="rounded-xl bg-navy px-4 py-3 font-bold text-white">
                    Sign in
                  </Link>
                  <Link href="/app/onboarding" className="rounded-xl bg-white px-4 py-3 font-bold text-navy">
                    Onboarding
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </PublicShell>
  );
}

function TextField({
  name,
  label,
  defaultValue = "",
  type = "text",
  disabled = false
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-navy">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        disabled={disabled}
        className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep disabled:opacity-60"
      />
    </label>
  );
}

function StatsGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(counts).map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-background p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate">{label.replace(/([A-Z])/g, " $1")}</p>
          <p className="mt-1 font-serif text-2xl font-bold text-navy">{value}</p>
        </div>
      ))}
    </div>
  );
}

function formatRole(role: string) {
  return role
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
