/**
 * API auth helper: require Firebase ID token for admin routes.
 */

import { verifyAuthToken, getBearerToken } from "@/lib/firebase-admin";
import type { DecodedIdToken } from "firebase-admin/auth";
import { apiError } from "./errors";

export type AuthResult = { user: DecodedIdToken } | { response: Response };

/**
 * Require authenticated user. Returns either { user } or { response } error.
 * Use in API route: const auth = await requireAuth(request); if ('response' in auth) return auth.response;
 */
export async function requireAuth(request: Request): Promise<AuthResult> {
  const token = getBearerToken(request);
  const decoded = await verifyAuthToken(token);
  if (!decoded) {
    return { response: apiError("UNAUTHORIZED", undefined, "Missing or invalid authorization token") };
  }
  return { user: decoded };
}
