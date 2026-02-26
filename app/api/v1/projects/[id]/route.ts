/**
 * DELETE /api/v1/projects/[id] - Delete a project (admin only).
 * Uses Firebase Admin SDK so delete works regardless of client Firestore rules.
 */

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { apiError, apiInternalError } from "@/lib/api/errors";
import { logAdminAction } from "@/lib/api/logger";
import { adminDeleteProject } from "@/lib/firestore-admin";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if ("response" in auth) return auth.response;

  try {
    const { id } = await params;
    if (!id) return apiError("BAD_REQUEST", undefined, "Project id required");
    await adminDeleteProject(id);
    logAdminAction("project.delete", auth.user.uid, { projectId: id });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return apiInternalError(err);
  }
}
