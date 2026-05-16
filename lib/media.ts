/**
 * Shared image URL helpers — no broken images, no fake placeholder content.
 */

/** 1×1 transparent SVG for Next/Image when no URL is available */
export const IMAGE_FALLBACK_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E";

export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== "string") return false;
  const t = url.trim();
  if (!t) return false;
  return (
    t.startsWith("http://") ||
    t.startsWith("https://") ||
    t.startsWith("/") ||
    t.startsWith("data:image/")
  );
}

/** Returns a safe src for Next/Image; never returns empty string */
export function getSafeImageSrc(url: string | null | undefined): string {
  return isValidImageUrl(url) ? url!.trim() : IMAGE_FALLBACK_SRC;
}
