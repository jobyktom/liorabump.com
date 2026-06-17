import { NextResponse } from "next/server";
import { getCurrentFamily } from "@/lib/app-data";
import { mediaUploadConfigs, getUploadLimit, safeFileName, formatBytes } from "@/lib/media";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();
  const familyId = current.family.id;
  const uploadLimit = getUploadLimit(current.family.subscription_plan);
  const { count, error: countError } = await supabase
    .from("media_assets")
    .select("id", { count: "exact", head: true })
    .eq("family_id", familyId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count ?? 0) >= uploadLimit) {
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
  const insertResult = await supabase.from("media_assets").insert({
    family_id: familyId,
    owner_id: current.userId,
    asset_type: config.assetType,
    storage_path: storagePath,
    caption: caption || file.name
  });

  if (insertResult.error) {
    await supabase.storage.from(config.bucket).remove([filePath]);
    return NextResponse.json({ error: insertResult.error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    remainingUploads: Math.max(0, uploadLimit - (count ?? 0) - 1)
  });
}
