/**
 * GET /api/v1/categories - List categories (admin only).
 * Query: ?all=true to return all categories; default returns active only.
 * Used by the admin dashboard sidebar and categories page to avoid client-side Firestore permission errors.
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { apiInternalError } from "@/lib/api/errors";
import { adminGetActiveCategories, adminGetAllCategories } from "@/lib/firestore-admin";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if ("response" in auth) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";
    const categories = all ? await adminGetAllCategories() : await adminGetActiveCategories();
    return NextResponse.json({ data: categories });
  } catch (err) {
    return apiInternalError(err);
  }
}
