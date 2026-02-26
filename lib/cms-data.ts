import type { CMSData } from "./cms-types";

// Default CMS data - this will be used as initial data
export const defaultCMSData: CMSData = {
  hero: {
    title: "A HIGHER QUALITY OF LIVING.",
    subtitle: "THAT BRING YOUR ASPIRATIONS TO LIFE.",
    backgroundImage: "/images/hero-bg.jpg",
  },
  about: {
    sectionTitle: "About Urvi Constructions",
    heading: "We Are The Leader In The Architectural",
    description:
      "At Urvi Constructions, we don't just build structures – we create havens where memories are made and futures take shape. Our commitment to quality and innovation has positioned us as a trusted name in the real estate industry, delivering exceptional residential and commercial projects. From towering apartments to elegant villas, expansive townhouses to bustling commercial spaces, our portfolio reflects our dedication to thoughtful design, sustainable development, and enduring value. Whether it's your first home or an investment property – we are your trusted partner for a lifetime.",
    image: "/images/about-building.jpg",
    propertyTypes: [
      { icon: "building", label: "Apartments" },
      { icon: "home", label: "Villas" },
      { icon: "townhouse", label: "Townhouse" },
      { icon: "commercial", label: "Commercial" },
    ],
  },
  projects: [
    {
      id: "1",
      title: "Opulent Vista",
      subtitle: "Residential Towers",
      location: "Newcity, Hyderabad",
      image: "/images/project-1.jpg",
      featured: true,
    },
    {
      id: "2",
      title: "Urban Nest",
      subtitle: "Residential Homes",
      location: "Kondapur, Hyderabad",
      image: "/images/project-2.jpg",
      featured: true,
    },
    {
      id: "3",
      title: "Green Haven",
      subtitle: "Residential Enclave",
      location: "Gachibowli, Hyderabad",
      image: "/images/project-3.jpg",
      featured: true,
    },
  ],
  video: {
    title: "Discover a place you'll love to live",
    backgroundImage: "/images/video-bg.jpg",
    videoUrl: "",
  },
  whyUs: {
    sectionTitle: "Why Urvi Constructions",
    heading: "What makes us Different",
    description:
      "It's not just about creating something good, it's about designing, developing, and collaborating to forge remarkable and incredible experiences.",
    features: [
      {
        id: "1",
        icon: "shield",
        title: "Corporate Responsibility",
        description:
          "Our priority is to collaborate with the customer towards our shared responsibility for housing society.",
      },
      {
        id: "2",
        icon: "users",
        title: "Experts with Team Spirit",
        description:
          "Our highly skilled team creates innovative, forward-thinking solutions.",
      },
      {
        id: "3",
        icon: "heart",
        title: "Diversity, Equity & Inclusion",
        description:
          "We strive to deliver innovations and solutions designed to serve everyone from all walks of life.",
      },
    ],
    images: ["/images/why-us-1.jpg", "/images/why-us-2.jpg"],
  },
  testimonials: [
    {
      id: "1",
      name: "Anisha Krishna",
      role: "Homeowner at Skylight Hill",
      content:
        "Working with Urvi Constructions was a wonderful experience! From start to finish, their team was professional, attentive, and delivered beyond our expectations. Highly recommend!",
      image: "/images/testimonial-1.jpg",
    },
    {
      id: "2",
      name: "Siddharth",
      role: "Homeowner at Riviera Home",
      content:
        "The quality of construction and attention to detail exceeded all my expectations. Urvi Constructions truly delivers on their promise of quality living spaces.",
      image: "/images/testimonial-2.jpg",
    },
  ],
  news: [
    {
      id: "1",
      category: "Markets",
      date: "November 10, 2025",
      title: "Housing Markets That Changed the Most This Decade",
      excerpt: "An analysis of shifting real estate trends and emerging markets.",
      image: "/images/news-1.jpg",
      slug: "housing-markets-changed",
    },
    {
      id: "2",
      category: "Apartment",
      date: "November 18, 2025",
      title: "Read Unveils the Best Canadian Cities for Renting",
      excerpt: "Discover the top cities offering affordable rental options.",
      image: "/images/news-2.jpg",
      slug: "best-canadian-cities-renting",
    },
    {
      id: "3",
      category: "Urban",
      date: "November 20, 2025",
      title: "10 Walkable Cities Where You Can Live Affordably",
      excerpt: "Explore cities that combine walkability with affordability.",
      image: "/images/news-3.jpg",
      slug: "walkable-cities-affordable",
    },
    {
      id: "4",
      category: "Blogs",
      date: "November 28, 2025",
      title: "New Apartments Now in the Best Canadian Cities",
      excerpt: "Latest developments in Canada's top urban centers.",
      image: "/images/news-4.jpg",
      slug: "new-apartments-canadian-cities",
    },
  ],
  contact: {
    address: "Reach Out to Us Anytime\n123 Example St., Any City, 12345 Any State",
    phone: "123-456-7890",
    email: "support@urvi.com",
    socialLinks: {
      facebook: "https://facebook.com/urviconstructions",
      twitter: "https://twitter.com/urviconstructions",
      linkedin: "https://linkedin.com/company/urviconstructions",
      instagram: "https://instagram.com/urviconstructions",
    },
  },
};

// In-memory store for CMS data (in production, use a database)
let cmsDataStore: CMSData = { ...defaultCMSData };

export function getCMSData(): CMSData {
  return cmsDataStore;
}

export function updateCMSData(section: keyof CMSData, data: CMSData[keyof CMSData]): CMSData {
  cmsDataStore = {
    ...cmsDataStore,
    [section]: data,
  };
  return cmsDataStore;
}

export function resetCMSData(): CMSData {
  cmsDataStore = { ...defaultCMSData };
  return cmsDataStore;
}
