import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Date.now();
    const ext = (file.name.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "");
    const baseName = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const dir = path.join(process.cwd(), "public", folder);
    await mkdir(dir, { recursive: true });
    const filepath = path.join(dir, baseName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    const url = `/${folder}/${baseName}`;
    return NextResponse.json({ url, filename: `${folder}/${baseName}`, size: file.size, type: file.type });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
