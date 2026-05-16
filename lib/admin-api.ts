import type { User } from "firebase/auth";

/** Authenticated fetch for admin API routes (Bearer Firebase ID token). */
export async function adminApiFetch(
  user: User,
  url: string,
  init?: RequestInit
): Promise<Response> {
  const token = await user.getIdToken();
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(url, { ...init, headers });
}
