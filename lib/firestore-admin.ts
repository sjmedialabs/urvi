/**
 * Firestore access via Firebase Admin SDK (server-side only).
 * Use in API routes for admin operations (leads list with pagination, etc.).
 * Do not import in client components.
 */

import { getApps, getApp } from "firebase-admin/app";
import {
  getFirestore,
  type Firestore,
  type Query,
  type DocumentSnapshot,
  type DocumentData,
} from "firebase-admin/firestore";
import type { Lead } from "./firestore";

/** Minimal category shape for API (id always present) */
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  heroImage?: string;
  heroTitle?: string;
  order: number;
  isActive: boolean;
}

let adminDb: Firestore | null = null;

function getAdminDb(): Firestore | null {
  if (adminDb) return adminDb;
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey
    ? rawKey.replace(/\\n/g, "\n").replace(/^["']|["']$/g, "").trim()
    : undefined;
  if (!projectId || !clientEmail || !privateKey) return null;
  try {
    const admin = require("firebase-admin");
    const app = getApps().length > 0 ? getApp() : admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
    adminDb = getFirestore(app);
    console.info("[firestore-admin] Initialized successfully for project:", projectId);
    return adminDb;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[firestore-admin] Failed to initialize:", message);
    return null;
  }
}

/** Whether Firebase Admin is configured (env vars set and init succeeded). Use in API routes to return 503 when not configured. */
export function isAdminConfigured(): boolean {
  return getAdminDb() != null;
}

export interface GetLeadsPaginatedParams {
  limit: number;
  cursor?: string;
  status?: Lead["status"];
  fromDate?: string;
  toDate?: string;
}

export interface GetLeadsPaginatedResult {
  items: (Lead & { id: string })[];
  nextCursor: string | null;
  hasMore: boolean;
}

/** Serialize Firestore timestamp for JSON response */
function serializeLead(d: DocumentSnapshot<DocumentData>): Lead & { id: string } {
  const data = d.data();
  if (!data) return { id: d.id } as Lead & { id: string };
  const created = (data.createdAt as { toDate?: () => Date })?.toDate?.();
  const updated = (data.updatedAt as { toDate?: () => Date })?.toDate?.();
  return {
    id: d.id,
    ...data,
    createdAt: created ? (created.toISOString() as unknown as Lead["createdAt"]) : undefined,
    updatedAt: updated ? (updated.toISOString() as unknown as Lead["updatedAt"]) : undefined,
  } as Lead & { id: string };
}

/**
 * Fetch leads with pagination and optional filters (status, date range).
 * Uses cursor-based pagination (nextCursor = last doc id).
 * Note: Using status + orderBy(createdAt) may require a composite index in Firestore.
 */
export async function getLeadsPaginated(params: GetLeadsPaginatedParams): Promise<GetLeadsPaginatedResult> {
  const db = getAdminDb();
  if (!db) return { items: [], nextCursor: null, hasMore: false };

  const { limit, cursor, status, fromDate, toDate } = params;
  const coll = db.collection("leads");

  // Build query: optional status, optional date range, orderBy createdAt desc, limit, startAfter
  let q: Query<DocumentData> = coll as unknown as Query<DocumentData>;
  if (status) q = q.where("status", "==", status);
  if (fromDate) q = q.where("createdAt", ">=", new Date(fromDate));
  if (toDate) q = q.where("createdAt", "<=", new Date(toDate));
  q = q.orderBy("createdAt", "desc").limit(limit + 1);

  if (cursor) {
    const cursorDoc = await db.collection("leads").doc(cursor).get();
    if (cursorDoc.exists) q = q.startAfter(cursorDoc);
  }

  const snapshot = await q.get();
  const docs = snapshot.docs;
  const hasMore = docs.length > limit;
  const items = (hasMore ? docs.slice(0, limit) : docs).map(serializeLead);
  const nextCursor = hasMore ? docs[limit - 1].id : null;

  return { items, nextCursor, hasMore };
}

/**
 * Get active categories (for admin sidebar). Uses Admin SDK.
 * Fetches all and filters/sorts in memory to avoid requiring a composite Firestore index.
 */
export async function adminGetActiveCategories(): Promise<CategoryItem[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("categories").get();
  const items = snapshot.docs
    .map((d) => {
      const data = d.data();
      return { id: d.id, ...data } as CategoryItem;
    })
    .filter((c) => c.isActive === true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return items;
}

/**
 * Get all categories (for admin categories page). Uses Admin SDK.
 * Fetches all and sorts in memory to avoid index issues.
 */
export async function adminGetAllCategories(): Promise<CategoryItem[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("categories").get();
  const items = snapshot.docs
    .map((d) => {
      const data = d.data();
      return { id: d.id, ...data } as CategoryItem;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return items;
}

/**
 * Update lead status (and optionally other fields) via Admin SDK.
 */
export async function updateLeadStatus(id: string, update: { status: Lead["status"] }): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  const ref = db.collection("leads").doc(id);
  await ref.update({
    ...update,
    updatedAt: new Date(),
  });
}

// --------------- CMS (server-side writes; use existing firestore.ts for reads) ---------------

export interface CMSPagePayload {
  slug: string;
  title: string;
  description?: string;
  isActive: boolean;
  isIndexed: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

export async function adminAddCMSPage(page: CMSPagePayload): Promise<string> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  const ref = await db.collection("cmsPages").add({
    ...page,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function adminUpdateCMSPage(id: string, page: Partial<CMSPagePayload>): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  await db.collection("cmsPages").doc(id).update({
    ...page,
    updatedAt: new Date(),
  });
}

export async function adminDeleteCMSPage(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  await db.collection("cmsPages").doc(id).delete();
}

export interface CMSSectionPayload {
  pageId: string;
  type: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  backgroundImage?: string;
  items?: unknown[];
  order: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
}

export async function adminAddCMSSection(section: CMSSectionPayload): Promise<string> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  const ref = await db.collection("cmsSections").add({
    ...section,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return ref.id;
}

export async function adminUpdateCMSSection(id: string, section: Partial<CMSSectionPayload>): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  await db.collection("cmsSections").doc(id).update({
    ...section,
    updatedAt: new Date(),
  });
}

export async function adminDeleteCMSSection(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  await db.collection("cmsSections").doc(id).delete();
}

// --------------- Projects (for seed / server-side create) ---------------

export interface ProjectPayload {
  title: string;
  type: string;
  location: string;
  image: string;
  description?: string;
  categoryId?: string;
  category?: string;
  status?: "ongoing" | "upcoming" | "completed";
  price?: string;
  featured?: boolean;
  slug?: string;
}

/** Generate URL-safe slug from title (and optional suffix for uniqueness). */
export function slugify(title: string, suffix?: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "project";
  return suffix ? `${base}-${suffix}` : base;
}

export async function adminAddProject(project: ProjectPayload): Promise<string> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  const collectionName = "projects";
  try {
    const ref = await db.collection(collectionName).add({
      ...project,
      slug: project.slug || slugify(project.title),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const slug = project.slug || slugify(project.title) + "-" + ref.id.slice(0, 8);
    await ref.update({ slug, updatedAt: new Date() });
    console.info("[firestore-admin] Wrote document", collectionName, ref.id);
    return ref.id;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[firestore-admin] adminAddProject failed:", msg);
    throw err;
  }
}

/** Project with id for API response */
export interface ProjectItem extends ProjectPayload {
  id: string;
}

export async function adminGetProjects(): Promise<ProjectItem[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
  const results: ProjectItem[] = [];
  for (const d of snapshot.docs) {
    const data = d.data() as Record<string, unknown> | undefined;
    const item = { id: d.id, ...data } as ProjectItem;
    if (!item.slug && item.title) {
      const backfillSlug = slugify(item.title) + "-" + d.id.slice(0, 8);
      try {
        await d.ref.update({ slug: backfillSlug, updatedAt: new Date() });
        item.slug = backfillSlug;
      } catch {
        item.slug = backfillSlug;
      }
    }
    results.push(item);
  }
  return results;
}

/** Update an existing project by id. Merges payload; updates slug from title if title changed. Strips undefined so Firestore accepts the update. */
export async function adminUpdateProject(id: string, payload: Partial<ProjectPayload>): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  const collectionName = "projects";
  const ref = db.collection(collectionName).doc(id);
  try {
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Project not found: " + collectionName + "/" + id);
    const data = { ...payload, updatedAt: new Date() } as Record<string, unknown>;
    if (payload.title != null) {
      data.slug = slugify(payload.title) + "-" + id.slice(0, 8);
    }
    const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
    await ref.update(clean);
    console.info("[firestore-admin] Updated document", collectionName, id);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[firestore-admin] adminUpdateProject failed for", collectionName + "/" + id + ":", msg);
    throw err;
  }
}

export async function adminDeleteProject(id: string): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  await db.collection("projects").doc(id).delete();
}

/** Get one project by id (for public API). Backfills slug if missing (so old projects get readable URLs). */
export async function adminGetProjectById(id: string): Promise<ProjectItem | null> {
  const db = getAdminDb();
  if (!db) return null;
  const ref = db.collection("projects").doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  const data = snap.data() as Record<string, unknown> | undefined;
  const item = { id: snap.id, ...data } as ProjectItem;
  if (!item.slug && item.title) {
    const backfillSlug = slugify(item.title) + "-" + id.slice(0, 8);
    try {
      await ref.update({ slug: backfillSlug, updatedAt: new Date() });
      item.slug = backfillSlug;
    } catch {
      item.slug = backfillSlug;
    }
  }
  return item;
}

/** Get one project by slug (for public API). */
export async function adminGetProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snapshot = await db.collection("projects").where("slug", "==", slug).limit(1).get();
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  const data = d.data() as Record<string, unknown> | undefined;
  return { id: d.id, ...data } as ProjectItem;
}

/** Serialize Firestore timestamp for JSON. */
function serializeTimestamp(t: unknown): string | undefined {
  if (!t) return undefined;
  if (typeof (t as { toDate?: () => Date }).toDate === "function") {
    return (t as { toDate: () => Date }).toDate().toISOString();
  }
  if (t instanceof Date) return t.toISOString();
  return undefined;
}

/** Get property details by projectId (for public API). */
export async function adminGetPropertyDetails(projectId: string): Promise<Record<string, unknown> | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.collection("propertyDetails").doc(projectId).get();
  if (!snap.exists) return null;
  const data = snap.data() as Record<string, unknown> | undefined;
  if (!data) return null;
  const out = { ...data, id: snap.id };
  if (data.createdAt) out.createdAt = serializeTimestamp(data.createdAt);
  if (data.updatedAt) out.updatedAt = serializeTimestamp(data.updatedAt);
  return out;
}

/** Get property amenities by propertyId (for public API). Uses where-only query to avoid composite index; sorts by order in memory. */
export async function adminGetPropertyAmenities(propertyId: string): Promise<Record<string, unknown>[]> {
  const db = getAdminDb();
  if (!db) return [];
  try {
    const snapshot = await db
      .collection("propertyAmenities")
      .where("propertyId", "==", propertyId)
      .get();
    const items = snapshot.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const out = { id: d.id, ...data };
      if (data.createdAt) out.createdAt = serializeTimestamp(data.createdAt);
      if (data.updatedAt) out.updatedAt = serializeTimestamp(data.updatedAt);
      return out;
    });
    items.sort((a, b) => (Number(a.order) ?? 0) - (Number(b.order) ?? 0));
    return items;
  } catch {
    return [];
  }
}

/** Get a document by collection and doc id (for content APIs). */
export async function adminGetDocument(
  collection: string,
  docId: string
): Promise<Record<string, unknown> | null> {
  const db = getAdminDb();
  if (!db) return null;
  const snap = await db.collection(collection).doc(docId).get();
  if (!snap.exists) return null;
  const data = snap.data() as Record<string, unknown>;
  const out = { id: snap.id, ...data };
  if (data?.updatedAt) out.updatedAt = serializeTimestamp(data.updatedAt);
  if (data?.createdAt) out.createdAt = serializeTimestamp(data.createdAt);
  return out;
}

/** Set (merge) a document (for CMS save APIs). */
export async function adminSetDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  const db = getAdminDb();
  if (!db) throw new Error("Firestore admin not configured");
  try {
    await db.collection(collectionName).doc(docId).set(
      { ...data, updatedAt: new Date() },
      { merge: true }
    );
    console.info("[firestore-admin] Set document", collectionName, docId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[firestore-admin] adminSetDocument failed for", collectionName + "/" + docId + ":", msg);
    throw err;
  }
}

/** Get all testimonials for public API (e.g. home page). */
export async function adminGetTestimonials(): Promise<Record<string, unknown>[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("testimonials").orderBy("createdAt", "desc").get();
  return snapshot.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const out = { id: d.id, ...data };
    if (data?.createdAt) out.createdAt = serializeTimestamp(data.createdAt);
    if (data?.updatedAt) out.updatedAt = serializeTimestamp(data.updatedAt);
    return out;
  });
}

/** Get all articles for public API (e.g. home recent news). */
export async function adminGetArticles(limit?: number): Promise<Record<string, unknown>[]> {
  const db = getAdminDb();
  if (!db) return [];
  let q = db.collection("articles").orderBy("createdAt", "desc");
  if (limit != null && limit > 0) q = q.limit(limit) as ReturnType<typeof q.limit>;
  const snapshot = await q.get();
  return snapshot.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    const out = { id: d.id, ...data };
    if (data?.createdAt) out.createdAt = serializeTimestamp(data.createdAt);
    if (data?.updatedAt) out.updatedAt = serializeTimestamp(data.updatedAt);
    return out;
  });
}
