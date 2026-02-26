/**
 * GET /api/v1/content/hero - Hero content (public, cached).
 */

import { NextResponse } from "next/server";
import { getHeroContent, getHeroSlides } from "@/lib/firestore";
import { apiInternalError } from "@/lib/api/errors";
import { unstable_cache } from "next/cache";

const CACHE_TTL = 60;

async function getHeroUncached() {
  const [content, slides] = await Promise.all([getHeroContent(), getHeroSlides()]);
  return { content, slides };
}

const getHeroCached = unstable_cache(getHeroUncached, ["content-hero"], { revalidate: CACHE_TTL });

export async function GET() {
  try {
    const data = await getHeroCached();
    return NextResponse.json({ data });
  } catch (err) {
    return apiInternalError(err);
  }
}
