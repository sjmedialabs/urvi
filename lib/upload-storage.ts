/**
 * Server-side uploads for production (Firebase Storage / Vercel Blob).
 * Local public/ writes only in development when cloud storage is not configured.
 */

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAdminApp } from "@/lib/firebase-admin";

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  type: string;
};

function sanitizeFolder(folder: string): string {
  const cleaned = folder.replace(/\\/g, "/").replace(/\.\./g, "").replace(/^\/+/, "");
  const segments = cleaned.split("/").filter((s) => s && /^[a-zA-Z0-9_-]+$/.test(s));
  return segments.length > 0 ? segments.join("/") : "uploads";
}

function fileExtension(fileName: string): string {
  return (fileName.split(".").pop() || "bin").replace(/[^a-z0-9]/gi, "") || "bin";
}

function uniqueFileName(ext: string): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
}

function storageBucketName(): string | null {
  return (
    process.env.FIREBASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() ||
    null
  );
}

async function uploadToLocal(
  buffer: Buffer,
  folder: string,
  baseName: string
): Promise<string> {
  const dir = path.join(process.cwd(), "public", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, baseName), buffer);
  return `/${folder}/${baseName}`;
}

async function uploadToFirebaseStorage(
  buffer: Buffer,
  objectPath: string,
  contentType: string
): Promise<string> {
  const app = getAdminApp();
  const bucketName = storageBucketName();
  if (!app || !bucketName) {
    throw new Error("Firebase Admin or storage bucket is not configured");
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const admin = require("firebase-admin") as typeof import("firebase-admin");
  const bucket = admin.storage(app).bucket(bucketName);
  const downloadToken = randomUUID();

  await bucket.file(objectPath).save(buffer, {
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });

  const encoded = encodeURIComponent(objectPath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encoded}?alt=media&token=${downloadToken}`;
}

async function uploadToVercelBlob(
  buffer: Buffer,
  pathname: string,
  contentType: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }

  const { put } = await import("@vercel/blob");
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType,
    token,
  });
  return blob.url;
}

function resolveProvider(): "blob" | "firebase" | "local" {
  const forced = process.env.UPLOAD_PROVIDER?.trim().toLowerCase();
  if (forced === "blob" || forced === "firebase" || forced === "local") {
    return forced;
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (getAdminApp() && storageBucketName()) return "firebase";
  if (process.env.NODE_ENV === "development") return "local";
  return "firebase";
}

export async function saveUploadedFile(file: File, folderInput: string): Promise<UploadResult> {
  const folder = sanitizeFolder(folderInput);
  const ext = fileExtension(file.name);
  const baseName = uniqueFileName(ext);
  const objectPath = `${folder}/${baseName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  let url: string;
  const provider = resolveProvider();

  try {
    switch (provider) {
      case "blob":
        url = await uploadToVercelBlob(buffer, objectPath, contentType);
        break;
      case "firebase":
        url = await uploadToFirebaseStorage(buffer, objectPath, contentType);
        break;
      case "local":
        url = await uploadToLocal(buffer, folder, baseName);
        break;
      default:
        url = await uploadToFirebaseStorage(buffer, objectPath, contentType);
    }
  } catch (primaryError) {
    if (provider === "blob" && getAdminApp() && storageBucketName()) {
      console.warn("[upload] Vercel Blob failed, falling back to Firebase Storage:", primaryError);
      url = await uploadToFirebaseStorage(buffer, objectPath, contentType);
    } else if (provider === "firebase" && process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("[upload] Firebase Storage failed, falling back to Vercel Blob:", primaryError);
      url = await uploadToVercelBlob(buffer, objectPath, contentType);
    } else {
      throw primaryError;
    }
  }

  return {
    url,
    filename: objectPath,
    size: file.size,
    type: contentType,
  };
}
