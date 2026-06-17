"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyInviteLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-2">
      <input
        value={url}
        readOnly
        className="h-11 rounded-xl border border-navy/10 bg-white px-3 text-xs text-slate"
        aria-label="Invite link"
      />
      <button
        type="button"
        onClick={() => void copy()}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-bold text-white"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copied" : "Copy invite link"}
      </button>
    </div>
  );
}
