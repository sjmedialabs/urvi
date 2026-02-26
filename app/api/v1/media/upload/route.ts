/**
 * POST /api/v1/media/upload - Upload image or icon (admin only).
 * FormData: file (required), folder (optional), type (optional: "image" | "icon").
 * Config: MAX_FILE_SIZE_MB, allowed types PNG/JPG/SVG/WebP.
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAuth } from "@/lib/api/auth";
import { apiError, apiInternalError } from "@/lib/api/errors";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
] as const;

const DEFAULT_MAX_BYTES = 10 * 1024 * 1024; // 10MB

function getMaxBytes(): number {
  const mb = process.env.MAX_UPLOAD_MB;
  if (mb == null) return DEFAULT_MAX_BYTES;
  const n = Number(mb);
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_MAX_BYTES;
  return n * 1024 * 1024;
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if ("response" in auth) return auth.response;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const typeHint = (formData.get("type") as string) || "image";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, JPG, GIF, WebP, SVG." },
        { status: 400 }
      );
    }

    const maxBytes = getMaxBytes();
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${maxBytes / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop() || "bin";
    const prefix = typeHint === "icon" ? "icons" : folder;
    const filename = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const blob = await put(filename, file, { access: "public" });

    return NextResponse.json({
      data: {
        url: blob.url,
        filename,
        size: file.size,
        type: file.type,
      },
    });
  } catch (err) {
    return apiInternalError(err);
  }
}
