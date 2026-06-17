export function inviteUrl(inviteId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  return `${appUrl.replace(/\/$/, "")}/invite/${inviteId}`;
}
