import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

// Helper to check if Firestore is available
function getDb() {
  if (!isFirebaseConfigured || !db) {
    console.log("[v0] Firestore not configured, using empty defaults");
    return null;
  }
  return db;
}

// Types
export interface Category {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  heroImage?: string;
  heroTitle?: string;
  order: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Project {
  id?: string;
  title: string;
  type: string;
  location: string;
  image: string;
  description?: string;
  categoryId?: string;
  category?: string;
  status?: 'ongoing' | 'upcoming' | 'completed';
  price?: string;
  featured?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  content: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Article {
  id?: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt?: string;
  content?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface HeroContent {
  id?: string;
  headline: string;
  subheadline: string;
  backgroundImage: string;
  updatedAt?: Timestamp;
}

export interface HeroSlide {
  id?: string;
  headline: string;
  subheadline: string;
  backgroundImage: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AboutContent {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  updatedAt?: Timestamp;
}

export interface ContactInfo {
  id?: string;
  address: string;
  phone: string;
  email: string;
  mapUrl?: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  updatedAt?: Timestamp;
}

export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected' | 'saved';
  notes?: string;
  propertyInterest?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface GalleryImage {
  id?: string;
  title: string;
  category: string;
  image: string;
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface PageContent {
  id?: string;
  pageName: string;
  title: string;
  subtitle?: string;
  content?: string;
  heroImage?: string;
  sections?: Record<string, unknown>[];
  updatedAt?: Timestamp;
}

// CMS Page (enhanced)
export interface CMSPage {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  isActive: boolean;
  isIndexed: boolean; // SEO indexing
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

// CMS Section types
export type CMSSectionType = 
  | 'hero'
  | 'about'
  | 'services'
  | 'features'
  | 'testimonials'
  | 'gallery'
  | 'cta'
  | 'contact'
  | 'projects'
  | 'team'
  | 'stats'
  | 'faq'
  | 'pricing'
  | 'newsletter'
  | 'custom';

export interface CMSSection {
  id?: string;
  pageId: string;
  type: CMSSectionType;
  title?: string;
  subtitle?: string;
  description?: string; // Rich text content
  buttonText?: string;
  buttonUrl?: string;
  image?: string;
  backgroundImage?: string;
  items?: CMSSectionItem[];
  order: number;
  isActive: boolean;
  settings?: Record<string, unknown>; // Custom settings per section type
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface CMSSectionItem {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  icon?: string;
  link?: string;
  order: number;
}

// Form Submission
export interface FormSubmission {
  id?: string;
  formId: string;
  formName: string;
  fields: Record<string, string>;
  source: string;
  userAgent?: string;
  ipAddress?: string;
  isRead: boolean;
  createdAt?: Timestamp;
}

// Form Configuration
export interface FormConfig {
  id?: string;
  name: string;
  slug: string;
  fields: FormField[];
  successMessage: string;
  emailNotification?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  validation?: string; // Regex pattern
}

export interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  leads: number;
  conversionRate: number;
}

// Property Amenity
export interface PropertyAmenity {
  id?: string;
  propertyId: string;
  name: string;
  image: string;
  galleryImages: string[];
  order: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Property Section Content
export interface PropertySectionContent {
  id?: string;
  propertyId: string;
  sectionType: 'hero' | 'stats' | 'about' | 'amenities' | 'floorPlan' | 'gallery' | 'location' | 'specifications' | 'video' | 'brochure';
  title?: string;
  subtitle?: string;
  description?: string;
  content?: Record<string, unknown>;
  order: number;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Extended Project with all property details
export interface PropertyDetails {
  id?: string;
  projectId: string;
  tagline: string;
  price: string;
  priceLabel: string;
  heroImage: string;
  about: string;
  reraNumber: string;
  videoUrl?: string;
  brochureUrl?: string;
  stats: {
    totalLandArea: string;
    noOfBlocks: string;
    totalUnits: string;
    configuration: string;
    floors: string;
    possessionStarts: string;
  };
  location: {
    address: string;
    mapUrl: string;
    nearbyPlaces: { name: string; distance: string; type: string }[];
  };
  specifications: {
    category: string;
    items: string[];
  }[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const projectsRef = collection(firestore, 'projects');
  const q = query(projectsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
}

export async function addProject(project: Omit<Project, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const projectsRef = collection(firestore, 'projects');
  const docRef = await addDoc(projectsRef, {
    ...project,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const projectRef = doc(firestore, 'projects', id);
  await updateDoc(projectRef, {
    ...project,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProject(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const projectRef = doc(firestore, 'projects', id);
  await deleteDoc(projectRef);
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const testimonialsRef = collection(firestore, 'testimonials');
  const q = query(testimonialsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
}

export async function addTestimonial(testimonial: Omit<Testimonial, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const testimonialsRef = collection(firestore, 'testimonials');
  const docRef = await addDoc(testimonialsRef, {
    ...testimonial,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const testimonialRef = doc(firestore, 'testimonials', id);
  await updateDoc(testimonialRef, {
    ...testimonial,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const testimonialRef = doc(firestore, 'testimonials', id);
  await deleteDoc(testimonialRef);
}

// Articles
export async function getArticles(): Promise<Article[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const articlesRef = collection(firestore, 'articles');
  const q = query(articlesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

export async function addArticle(article: Omit<Article, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const articlesRef = collection(firestore, 'articles');
  const docRef = await addDoc(articlesRef, {
    ...article,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateArticle(id: string, article: Partial<Article>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const articleRef = doc(firestore, 'articles', id);
  await updateDoc(articleRef, {
    ...article,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteArticle(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const articleRef = doc(firestore, 'articles', id);
  await deleteDoc(articleRef);
}

// Hero Content (singleton - legacy)
export async function getHeroContent(): Promise<HeroContent | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const heroRef = doc(firestore, 'settings', 'hero');
  const snapshot = await getDoc(heroRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as HeroContent;
  }
  return null;
}

export async function updateHeroContent(content: Partial<HeroContent>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const heroRef = doc(firestore, 'settings', 'hero');
  await setDoc(heroRef, {
    ...content,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

// Hero Slides (carousel)
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const slidesRef = collection(firestore, 'heroSlides');
  const q = query(slidesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
}

export async function addHeroSlide(slide: Omit<HeroSlide, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const slidesRef = collection(firestore, 'heroSlides');
  const docRef = await addDoc(slidesRef, {
    ...slide,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateHeroSlide(id: string, slide: Partial<HeroSlide>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const slideRef = doc(firestore, 'heroSlides', id);
  await updateDoc(slideRef, {
    ...slide,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const slideRef = doc(firestore, 'heroSlides', id);
  await deleteDoc(slideRef);
}

// About Content (singleton)
export async function getAboutContent(): Promise<AboutContent | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const aboutRef = doc(firestore, 'settings', 'about');
  const snapshot = await getDoc(aboutRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as AboutContent;
  }
  return null;
}

export async function updateAboutContent(content: Partial<AboutContent>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const aboutRef = doc(firestore, 'settings', 'about');
  await setDoc(aboutRef, {
    ...content,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

// Contact Info (singleton)
export async function getContactInfo(): Promise<ContactInfo | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const contactRef = doc(firestore, 'settings', 'contact');
  const snapshot = await getDoc(contactRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as ContactInfo;
  }
  return null;
}

export async function updateContactInfo(info: Partial<ContactInfo>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const contactRef = doc(firestore, 'settings', 'contact');
  await setDoc(contactRef, {
    ...info,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

// Leads
export async function getLeads(): Promise<Lead[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const leadsRef = collection(firestore, 'leads');
  const q = query(leadsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
}

export async function addLead(lead: Omit<Lead, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const leadsRef = collection(firestore, 'leads');
  const docRef = await addDoc(leadsRef, {
    ...lead,
    status: 'new',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateLead(id: string, lead: Partial<Lead>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const leadRef = doc(firestore, 'leads', id);
  await updateDoc(leadRef, {
    ...lead,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteLead(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const leadRef = doc(firestore, 'leads', id);
  await deleteDoc(leadRef);
}

// Gallery
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const galleryRef = collection(firestore, 'gallery');
  const q = query(galleryRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
}

export async function addGalleryImage(image: Omit<GalleryImage, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const galleryRef = collection(firestore, 'gallery');
  const docRef = await addDoc(galleryRef, {
    ...image,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateGalleryImage(id: string, image: Partial<GalleryImage>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const imageRef = doc(firestore, 'gallery', id);
  await updateDoc(imageRef, {
    ...image,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const imageRef = doc(firestore, 'gallery', id);
  await deleteDoc(imageRef);
}

// Page Content
export async function getPageContent(pageName: string): Promise<PageContent | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const pageRef = doc(firestore, 'pages', pageName);
  const snapshot = await getDoc(pageRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as PageContent;
  }
  return null;
}

export async function updatePageContent(pageName: string, content: Partial<PageContent>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const pageRef = doc(firestore, 'pages', pageName);
  await setDoc(pageRef, {
    ...content,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

export async function getAllPages(): Promise<PageContent[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const pagesRef = collection(firestore, 'pages');
  const snapshot = await getDocs(pagesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PageContent));
}

// Dashboard Stats
export async function getDashboardStats(): Promise<{
  projects: number;
  testimonials: number;
  articles: number;
  leads: number;
  gallery: number;
}> {
  const firestore = getDb();
  if (!firestore) return { projects: 0, testimonials: 0, articles: 0, leads: 0, gallery: 0 };
  
  const [projects, testimonials, articles, leads, gallery] = await Promise.all([
    getDocs(collection(firestore, 'projects')),
    getDocs(collection(firestore, 'testimonials')),
    getDocs(collection(firestore, 'articles')),
    getDocs(collection(firestore, 'leads')),
    getDocs(collection(firestore, 'gallery')),
  ]);
  
  return {
    projects: projects.size,
    testimonials: testimonials.size,
    articles: articles.size,
    leads: leads.size,
    gallery: gallery.size,
  };
}

// Property Amenities
export async function getPropertyAmenities(propertyId: string): Promise<PropertyAmenity[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const amenitiesRef = collection(firestore, 'propertyAmenities');
  const q = query(amenitiesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as PropertyAmenity))
    .filter(amenity => amenity.propertyId === propertyId);
}

export async function addPropertyAmenity(amenity: Omit<PropertyAmenity, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const amenitiesRef = collection(firestore, 'propertyAmenities');
  const docRef = await addDoc(amenitiesRef, {
    ...amenity,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updatePropertyAmenity(id: string, amenity: Partial<PropertyAmenity>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const amenityRef = doc(firestore, 'propertyAmenities', id);
  await updateDoc(amenityRef, {
    ...amenity,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePropertyAmenity(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const amenityRef = doc(firestore, 'propertyAmenities', id);
  await deleteDoc(amenityRef);
}

// Property Details
export async function getPropertyDetails(projectId: string): Promise<PropertyDetails | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const detailsRef = doc(firestore, 'propertyDetails', projectId);
  const snapshot = await getDoc(detailsRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as PropertyDetails;
  }
  return null;
}

export async function updatePropertyDetails(projectId: string, details: Partial<PropertyDetails>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const detailsRef = doc(firestore, 'propertyDetails', projectId);
  const snapshot = await getDoc(detailsRef);
  
  if (snapshot.exists()) {
    await updateDoc(detailsRef, {
      ...details,
      updatedAt: Timestamp.now(),
    });
  } else {
    await addDoc(collection(firestore, 'propertyDetails'), {
      ...details,
      projectId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

// Property Section Content
export async function getPropertySections(propertyId: string): Promise<PropertySectionContent[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const sectionsRef = collection(firestore, 'propertySections');
  const q = query(sectionsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as PropertySectionContent))
    .filter(section => section.propertyId === propertyId);
}

export async function updatePropertySection(id: string, section: Partial<PropertySectionContent>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionRef = doc(firestore, 'propertySections', id);
  await updateDoc(sectionRef, {
    ...section,
    updatedAt: Timestamp.now(),
  });
}

export async function addPropertySection(section: Omit<PropertySectionContent, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionsRef = collection(firestore, 'propertySections');
  const docRef = await addDoc(sectionsRef, {
    ...section,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deletePropertySection(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionRef = doc(firestore, 'propertySections', id);
  await deleteDoc(sectionRef);
}

// Get single project by ID
export async function getProjectById(id: string): Promise<Project | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const projectRef = doc(firestore, 'projects', id);
  const snapshot = await getDoc(projectRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as Project;
  }
  return null;
}

// ==================== CMS Pages ====================
export async function getCMSPages(): Promise<CMSPage[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const pagesRef = collection(firestore, 'cmsPages');
  const q = query(pagesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CMSPage));
}

export async function getCMSPageBySlug(slug: string): Promise<CMSPage | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const pagesRef = collection(firestore, 'cmsPages');
  const snapshot = await getDocs(pagesRef);
  const page = snapshot.docs.find(doc => doc.data().slug === slug);
  if (page) {
    return { id: page.id, ...page.data() } as CMSPage;
  }
  return null;
}

export async function addCMSPage(page: Omit<CMSPage, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const pagesRef = collection(firestore, 'cmsPages');
  const docRef = await addDoc(pagesRef, {
    ...page,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCMSPage(id: string, page: Partial<CMSPage>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const pageRef = doc(firestore, 'cmsPages', id);
  await updateDoc(pageRef, {
    ...page,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCMSPage(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const pageRef = doc(firestore, 'cmsPages', id);
  await deleteDoc(pageRef);
}

// ==================== CMS Sections ====================
export async function getCMSSections(pageId: string): Promise<CMSSection[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const sectionsRef = collection(firestore, 'cmsSections');
  const q = query(sectionsRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as CMSSection))
    .filter(section => section.pageId === pageId);
}

export async function addCMSSection(section: Omit<CMSSection, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionsRef = collection(firestore, 'cmsSections');
  const docRef = await addDoc(sectionsRef, {
    ...section,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCMSSection(id: string, section: Partial<CMSSection>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionRef = doc(firestore, 'cmsSections', id);
  await updateDoc(sectionRef, {
    ...section,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCMSSection(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const sectionRef = doc(firestore, 'cmsSections', id);
  await deleteDoc(sectionRef);
}

// ==================== Form Submissions ====================
export async function getFormSubmissions(formId?: string): Promise<FormSubmission[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const submissionsRef = collection(firestore, 'formSubmissions');
  const q = query(submissionsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const submissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormSubmission));
  if (formId) {
    return submissions.filter(s => s.formId === formId);
  }
  return submissions;
}

export async function addFormSubmission(submission: Omit<FormSubmission, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const submissionsRef = collection(firestore, 'formSubmissions');
  const docRef = await addDoc(submissionsRef, {
    ...submission,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function markSubmissionAsRead(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const submissionRef = doc(firestore, 'formSubmissions', id);
  await updateDoc(submissionRef, { isRead: true });
}

export async function deleteFormSubmission(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const submissionRef = doc(firestore, 'formSubmissions', id);
  await deleteDoc(submissionRef);
}

// ==================== Form Configs ====================
export async function getFormConfigs(): Promise<FormConfig[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const configsRef = collection(firestore, 'formConfigs');
  const snapshot = await getDocs(configsRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormConfig));
}

export async function getFormConfigBySlug(slug: string): Promise<FormConfig | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const configsRef = collection(firestore, 'formConfigs');
  const snapshot = await getDocs(configsRef);
  const config = snapshot.docs.find(doc => doc.data().slug === slug);
  if (config) {
    return { id: config.id, ...config.data() } as FormConfig;
  }
  return null;
}

export async function addFormConfig(config: Omit<FormConfig, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const configsRef = collection(firestore, 'formConfigs');
  const docRef = await addDoc(configsRef, {
    ...config,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateFormConfig(id: string, config: Partial<FormConfig>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const configRef = doc(firestore, 'formConfigs', id);
  await updateDoc(configRef, {
    ...config,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteFormConfig(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const configRef = doc(firestore, 'formConfigs', id);
  await deleteDoc(configRef);
}

// ============ Categories ============

export async function getCategories(): Promise<Category[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const categoriesRef = collection(firestore, 'categories');
  const q = query(categoriesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
}

export async function getActiveCategories(): Promise<Category[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const categoriesRef = collection(firestore, 'categories');
  const q = query(categoriesRef, where('isActive', '==', true), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const firestore = getDb();
  if (!firestore) return null;
  const categoriesRef = collection(firestore, 'categories');
  const q = query(categoriesRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Category;
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const categoriesRef = collection(firestore, 'categories');
  const docRef = await addDoc(categoriesRef, {
    ...category,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const categoryRef = doc(firestore, 'categories', id);
  await updateDoc(categoryRef, {
    ...category,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  const firestore = getDb();
  if (!firestore) throw new Error('Firestore not configured');
  const categoryRef = doc(firestore, 'categories', id);
  await deleteDoc(categoryRef);
}

// ============ Projects by Category ============

export async function getProjectsByCategory(categorySlug: string): Promise<Project[]> {
  const firestore = getDb();
  if (!firestore) return [];
  const projectsRef = collection(firestore, 'projects');
  const q = query(projectsRef, where('category', '==', categorySlug));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}
