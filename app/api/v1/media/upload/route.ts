/**
 * POST /api/v1/media/upload - Upload image or icon (admin only).
 * FormData: file (required), folder (optional), type (optional: "image" | "icon").
 * Saves to public/uploads (or public/icons). Config: MAX_UPLOAD_MB.
 */

import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/api/auth";
import { apiInternalError } from "@/lib/api/errors";

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

    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "");
    const prefix = typeHint === "icon" ? "icons" : folder;
    const baseName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const dir = path.join(process.cwd(), "public", prefix);
    await mkdir(dir, { recursive: true });
    const filepath = path.join(dir, baseName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    const url = `/${prefix}/${baseName}`;

    return NextResponse.json({
      data: {
        url,
        filename: `${prefix}/${baseName}`,
        size: file.size,
        type: file.type,
      },
    });
  } catch (err) {
    return apiInternalError(err);
  }
}
