/**
 * GET /api/v1/projects/public - List all projects (no auth).
 * Used by the public website so projects show even when client Firestore is not configured or rules block.
 */

import { NextResponse } from "next/server";
import { apiInternalError } from "@/lib/api/errors";
import { adminGetProjects, type ProjectItem } from "@/lib/firestore-admin";

export const dynamic = "force-dynamic";

function serializeProject(p: ProjectItem): Record<string, unknown> {
  const data = { ...p } as Record<string, unknown>;
  if (data.createdAt && typeof (data.createdAt as { toDate?: () => Date }).toDate === "function") {
    data.createdAt = (data.createdAt as { toDate: () => Date }).toDate().toISOString();
  }
  if (data.updatedAt && typeof (data.updatedAt as { toDate?: () => Date }).toDate === "function") {
    data.updatedAt = (data.updatedAt as { toDate: () => Date }).toDate().toISOString();
  }
  return data;
}

export async function GET() {
  try {
    const projects = await adminGetProjects();
    const data = projects.map(serializeProject);
    return NextResponse.json({ data });
  } catch (err) {
    return apiInternalError(err);
  }
}
