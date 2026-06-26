import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { mediaUploadConfigs, getUploadLimit, safeFileName, formatBytes } from "@/lib/media";
import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const current = await getCurrentFamily();

  if (!current) {
    return NextResponse.json({ error: "Please sign in and complete onboarding before uploading files." }, { status: 401 });
  }

  const formData = await req.formData();
  const section = String(formData.get("section") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();
  const file = formData.get("file");
  const config = mediaUploadConfigs[section];

  if (!config) {
    return NextResponse.json({ error: "This app section does not accept uploads." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file before uploading." }, { status: 400 });
  }

  if (!config.allowedMimeTypes.includes(file.type)) {
    return NextResponse.json({ error: "This file type is not supported for this section." }, { status: 400 });
  }

  if (file.size > config.maxBytes) {
    return NextResponse.json({ error: `File is too large. Maximum size is ${formatBytes(config.maxBytes)}.` }, { status: 400 });
  }

  const prisma = getPrisma();
  const supabase = createAdminClient();
  const familyId = current.family.id;
  const uploadLimit = getUploadLimit(current.family.subscription_plan);
  const count = await prisma.mediaAsset.count({ where: { familyId } });

  if (count >= uploadLimit) {
    return NextResponse.json(
      {
        error:
          current.family.subscription_plan === "free"
            ? "Your free plan upload limit has been reached. Upgrade to Premium to add more files."
            : "This family has reached its upload limit."
      },
      { status: 402 }
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filePath = `${familyId}/${current.userId}/${Date.now()}-${safeFileName(file.name)}`;
  const uploadResult = await supabase.storage.from(config.bucket).upload(filePath, bytes, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });

  if (uploadResult.error) {
    return NextResponse.json({ error: uploadResult.error.message }, { status: 500 });
  }

  const storagePath = `${config.bucket}/${filePath}`;
  try {
    await prisma.mediaAsset.create({
      data: {
        familyId,
        ownerId: current.userId,
        assetType: config.assetType,
        storagePath,
        caption: caption || file.name
      }
    });
  } catch (error) {
    await supabase.storage.from(config.bucket).remove([filePath]);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save upload metadata." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    remainingUploads: Math.max(0, uploadLimit - count - 1)
  });
}
