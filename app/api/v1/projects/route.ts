/**
 * GET /api/v1/projects - List all projects (admin only).
 * POST /api/v1/projects - Create a project (admin only). Returns { data: { id } }.
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { apiError, apiInternalError } from "@/lib/api/errors";
import { adminAddProject, adminGetProjects } from "@/lib/firestore-admin";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if ("response" in auth) return auth.response;

  try {
    const projects = await adminGetProjects();
    return NextResponse.json({ data: projects });
  } catch (err) {
    console.error("[API] GET /api/v1/projects error:", err);
    return apiInternalError(err);
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if ("response" in auth) return auth.response;

  try {
    const body = await request.json();
    const { title, type, location, image, description, categoryId, category, status, price, featured } = body;
    if (!title || !type || !location) {
      return apiError("BAD_REQUEST", undefined, "title, type, and location are required");
    }
    const id = await adminAddProject({
      title: String(title),
      type: String(type),
      location: String(location),
      image: image ? String(image) : "",
      description: description ? String(description) : undefined,
      categoryId: categoryId ? String(categoryId) : undefined,
      category: category ? String(category) : undefined,
      status: status ? String(status) as "ongoing" | "upcoming" | "completed" : undefined,
      price: price ? String(price) : undefined,
      featured: Boolean(featured),
    });
    return NextResponse.json({ data: { id } }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/v1/projects error:", err);
    return apiInternalError(err);
  }
}
