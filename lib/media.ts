import type { MediaAssetType } from "@/lib/database.types";

export type MediaUploadConfig = {
  bucket: string;
  assetType: MediaAssetType;
  accept: string;
  allowedMimeTypes: string[];
  maxBytes: number;
  title: string;
  helper: string;
};

export const mediaUploadConfigs: Record<string, MediaUploadConfig> = {
  album: {
    bucket: "pregnancy-photos",
    assetType: "photo",
    accept: "image/png,image/jpeg,image/webp",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    maxBytes: 10 * 1024 * 1024,
    title: "Upload a photo",
    helper: "Save bump photos and family memories privately."
  },
  "scan-uploads": {
    bucket: "scan-uploads",
    assetType: "scan",
    accept: "image/png,image/jpeg,image/webp,application/pdf",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "application/pdf"],
    maxBytes: 20 * 1024 * 1024,
    title: "Upload a scan",
    helper: "Save scan images or PDF scan reports privately."
  },
  "health-tracker": {
    bucket: "health-documents",
    assetType: "document",
    accept: "application/pdf,image/png,image/jpeg,image/webp",
    allowedMimeTypes: ["application/pdf", "image/png", "image/jpeg", "image/webp"],
    maxBytes: 20 * 1024 * 1024,
    title: "Upload a health document",
    helper: "Save hospital letters, blood test PDFs, or appointment documents privately."
  },
  "baby-profile": {
    bucket: "baby-albums",
    assetType: "photo",
    accept: "image/png,image/jpeg,image/webp",
    allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    maxBytes: 10 * 1024 * 1024,
    title: "Upload a baby photo",
    helper: "Save baby photos alongside milestones."
  }
};

const uploadLimits: Record<string, number> = {
  free: 5,
  premium: 100,
  family: 500
};

export function hasMediaUpload(section: string) {
  return Boolean(mediaUploadConfigs[section]);
}

export function getUploadLimit(planId: string | null | undefined) {
  return uploadLimits[planId ?? "free"] ?? uploadLimits.free;
}

export function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export function parseStoragePath(storagePath: string) {
  const separator = storagePath.indexOf("/");
  if (separator === -1) return null;

  return {
    bucket: storagePath.slice(0, separator),
    filePath: storagePath.slice(separator + 1)
  };
}

export function isImageStoragePath(storagePath: string) {
  return /\.(png|jpe?g|webp)$/i.test(storagePath);
}

export function isPdfStoragePath(storagePath: string) {
  return /\.pdf$/i.test(storagePath);
}

export function safeFileName(fileName: string) {
  const parts = fileName.split(".");
  const extension = parts.length > 1 ? `.${parts.pop()}` : "";
  const base = parts.join(".") || "upload";
  return `${base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}${extension.toLowerCase()}`;
}
