"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { mediaUploadConfigs } from "@/lib/media";

export function MediaUploadForm({
  section,
  currentCount,
  uploadLimit,
  planName
}: {
  section: string;
  currentCount: number;
  uploadLimit: number;
  planName: string;
}) {
  const config = mediaUploadConfigs[section];
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isAtLimit = currentCount >= uploadLimit;

  if (!config) return null;

  async function upload() {
    if (!config || !file) {
      setMessage("Choose a file first.");
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      if (isAtLimit) {
        setMessage("Your current plan upload limit has been reached.");
        return;
      }

      const body = new FormData();
      body.set("section", section);
      body.set("caption", caption);
      body.set("file", file);
      const response = await fetch("/api/media/upload", {
        method: "POST",
        body
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) throw new Error(result.error ?? "Upload failed.");

      setCaption("");
      setFile(null);
      setMessage("Upload saved privately. Refreshing...");
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mt-8 rounded-3xl border border-coral/15 bg-peach/35 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-coral">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-navy">{config.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate">{config.helper}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-coral">
            {currentCount}/{uploadLimit} uploads used on {planName}
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-navy">
          Caption
          <input
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            className="h-14 rounded-2xl border border-navy/10 bg-background px-4 text-base font-normal outline-none focus:ring-2 focus:ring-lavenderDeep"
            placeholder="20-week scan, week 24 bump photo..."
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-navy">
          File
          <input
            type="file"
            accept={config.accept}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="rounded-2xl border border-dashed border-navy/20 bg-background p-4 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-navy file:px-4 file:py-2 file:font-bold file:text-white"
          />
        </label>
        <button
          type="button"
          onClick={() => void upload()}
          disabled={isUploading || isAtLimit}
          className="h-14 rounded-2xl bg-navy font-bold text-white disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : isAtLimit ? "Upload limit reached" : "Upload privately"}
        </button>
        {isAtLimit ? (
          <a href="/pricing" className="rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-navy">
            Upgrade your plan to add more private uploads.
          </a>
        ) : null}
        {message ? <p className="rounded-2xl bg-white p-4 text-sm font-semibold leading-6 text-navy">{message}</p> : null}
      </div>
    </div>
  );
}
