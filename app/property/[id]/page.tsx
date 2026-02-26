"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, MapPin, Phone, ChevronRight, Plus, Minus, X, ChevronLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  getProjects,
  getPropertyDetails,
  getPropertyAmenities,
  getProjectById,
  type Project,
  type PropertyDetails,
  type PropertyAmenity,
} from "@/lib/firestore";

// Default property data
const defaultProperty = {
  id: "1",
  title: "Opulent Vista Residential Towers",
  tagline: "YOUR HOME TO LIVE YOUR LIFE AT ITS BEST",
  price: "7.45 CR",
  priceLabel: "Price",
  reraNumber: "P02400007694",
  location: "Narsingi, Hyderabad",
  heroImage: "/images/project-1.jpg",
  stats: {
    totalLandArea: "2.8 Acres",
    noOfBlocks: "4",
    totalUnits: "95",
    configuration: "2&3 BHK Apts",
    floors: "2B+G+15 Floors",
    possessionStarts: "Dec 2026",
  },
  about: `Urvi Skyline Project is the most luxurious projects in Narsingi, - Hyderabad's most desirable and future investment ready micro-market. Skyline's range from 2 Bedroom Homes and 3 Bedroom Homes with an area range of 1625 sft and 2020 sft respectively. We offer more than what you're looking for. 

At Skyline, we will deliver superior design and uncompromising quality that transforms your living experience. Designed with contemporary aesthetics, intelligent space planning, the homes embrace abundant natural light and ventilation.

Urvi Constructions is embarking on a transformative journey in the real estate industry. As a new name with fresh perspectives, we are committed to redefining modern living through innovative design, superior craftsmanship, and a deep understanding of contemporary lifestyles.

Our projects aim to blend functionality with elegance, creating spaces that inspire and enrich the lives of our clients.`,
  amenities: [
    { name: "Gym", image: "/images/amenity-gym.jpg" },
    { name: "Swimming Pool", image: "/images/amenity-pool.jpg" },
    { name: "Club House", image: "/images/amenity-club.jpg" },
    { name: "Children Play Area", image: "/images/amenity-play.jpg" },
    { name: "Jogging Track", image: "/images/amenity-jog.jpg" },
    { name: "Indoor Games", image: "/images/amenity-games.jpg" },
    { name: "Landscaped Gardens", image: "/images/amenity-garden.jpg" },
    { name: "24/7 Security", image: "/images/amenity-security.jpg" },
  ],
  floorPlans: [
    { name: "Type A - 2 BHK", image: "/images/floor-plan-1.jpg" },
    { name: "Type B - 3 BHK", image: "/images/floor-plan-2.jpg" },
    { name: "Type C - 3 BHK Duplex", image: "/images/floor-plan-3.jpg" },
  ],
  gallery: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/gallery-6.jpg",
  ],
  nearbyPlaces: {
    hospitals: [
      { name: "Apollo Hospital", distance: "4 km" },
      { name: "KIMS Hospital", distance: "6 km" },
    ],
    schools: [
      { name: "Delhi Public School", distance: "2 km" },
      { name: "Oakridge International", distance: "5 km" },
    ],
    itParks: [
      { name: "Financial District", distance: "3 km" },
      { name: "HITEC City", distance: "8 km" },
    ],
    connectivity: [
      { name: "ORR Exit", distance: "1 km" },
      { name: "Rajiv Gandhi International Airport", distance: "25 km" },
    ],
  },
  specifications: {
    "foundation": {
      title: "Foundation & Structural Frame",
      items: [
        { title: "Foundation", details: ["RCC framed structure with anti-termite treatment"] },
        { title: "Structure Frame", details: ["RCC framed structure with earthquake resistant design"] },
      ]
    },
    "walls": {
      title: "Walls",
      items: [
        { title: "External Walls", details: ["6\" thick red brick masonry walls with weather coat paint"] },
        { title: "Internal Walls", details: ["4\" thick red brick masonry walls with POP finish"] },
      ]
    },
    "floor-height": {
      title: "Floor to Floor Height",
      items: [
        { title: "Floor Height", details: ["10'6\" floor to floor height for spacious living"] },
      ]
    },
    "joinery": {
      title: "Joinery Works",
      items: [
        { title: "Modular Kitchen", details: ["Granite platform with stainless steel sink and provision for water purifier"] },
        { title: "Wardrobes", details: ["Provision for modular wardrobes in all bedrooms"] },
      ]
    },
    "windows-doors": {
      title: "Windows/Doors",
      items: [
        { title: "Main Door", details: ["Frame: 2400 mm x 1200 mm Hardwood frame finished with melamine spray polish", "Shutters: Hardwood shutters finished with melamine spray polish and designer hardware"] },
        { title: "Bathroom Doors", details: ["Frame: Granite frame", "Shutters: Two sides laminated flush shutters with designer hardware"] },
        { title: "Internal Doors", details: ["Frame: Hardwood frame finished with melamine spray polish", "Shutters: Hardwood flush shutters with laminated finish and designer hardware"] },
        { title: "Main Balcony", details: ["Shutters: uPVC glazed sliding door, with mosquito mesh provision"] },
        { title: "Master Bedroom Balcony", details: ["Shutters: uPVC glazed sliding door, with mosquito mesh provision"] },
        { title: "KBR 2 Balcony", details: ["Shutters: uPVC glazed sliding door, with mosquito mesh provision"] },
      ]
    },
    "flooring": {
      title: "Flooring & Cladding",
      items: [
        { title: "Living & Dining", details: ["Premium vitrified tiles (800mm x 800mm)"] },
        { title: "Bedrooms", details: ["Premium vitrified tiles (600mm x 600mm)"] },
        { title: "Bathrooms", details: ["Anti-skid ceramic tiles with designer wall tiles"] },
      ]
    },
    "plumbing": {
      title: "Plumbing & Fittings",
      items: [
        { title: "Water Supply", details: ["CPVC pipes for hot water and uPVC pipes for cold water"] },
        { title: "Sanitary Fittings", details: ["Premium branded sanitary fittings (Jaguar/Kohler or equivalent)"] },
      ]
    },
    "electrical": {
      title: "Electrical",
      items: [
        { title: "Wiring", details: ["Concealed copper wiring with modular switches (Anchor Roma or equivalent)"] },
        { title: "Power Backup", details: ["100% power backup for common areas"] },
      ]
    },
    "balcony-railing": {
      title: "Balcony Railing",
      items: [
        { title: "Railing Type", details: ["SS railing with toughened glass panels and designer handrails"] },
      ]
    },
    "vrf": {
      title: "VRF",
      items: [
        { title: "AC Provision", details: ["VRF system ready with copper piping and drain provision"] },
      ]
    },
    "tv-internet": {
      title: "TV/Internet",
      items: [
        { title: "Connectivity", details: ["Provision for cable TV and broadband internet in all rooms"] },
      ]
    },
  },
  projectStatusVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  walkThroughVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
};

const navTabs = [
  { id: "overview", label: "Over view" },
  { id: "amenities", label: "Amenities" },
  { id: "floor-plan", label: "Floor Plan" },
  { id: "gallery", label: "Gallary" },
  { id: "location", label: "Location Advantages" },
  { id: "project-status", label: "Project Status" },
  { id: "specifications", label: "Specifications" },
  { id: "walkthrough", label: "Project video" },
  { id: "brochure", label: "brochure" },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [amenities, setAmenities] = useState<PropertyAmenity[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [activePlanType, setActivePlanType] = useState("master");
  const [expandedSpec, setExpandedSpec] = useState<string | null>("structure");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeAmenity, setActiveAmenity] = useState<number | null>(null);
  const [hoveredAmenity, setHoveredAmenity] = useState<number | null>(null);
  const [floorPlanSlide, setFloorPlanSlide] = useState(0);
  const [mainGalleryOpen, setMainGalleryOpen] = useState(false);
  const [mainGalleryIndex, setMainGalleryIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isWalkThroughPlaying, setIsWalkThroughPlaying] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState("windows-doors");
  const videoRef = useRef<HTMLVideoElement>(null);
  const walkThroughVideoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const walkThroughSectionRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsPlaceholderRef = useRef<HTMLDivElement>(null);
  const [isTabsSticky, setIsTabsSticky] = useState(false);

  // Specification tabs list
  const specificationTabs = [
    { id: "foundation", label: "Foundation &", sublabel: "Structural Frame" },
    { id: "walls", label: "Walls" },
    { id: "floor-height", label: "Floor to Floor Height" },
    { id: "joinery", label: "Joinery Works" },
    { id: "windows-doors", label: "Windows/Doors" },
    { id: "flooring", label: "Flooring & Cladding" },
    { id: "plumbing", label: "Plumbing & Fittings" },
    { id: "electrical", label: "Electrical" },
    { id: "balcony-railing", label: "Balcony Railing" },
    { id: "vrf", label: "VRF" },
    { id: "tv-internet", label: "TV/Internet" },
  ];



  // Handle video play/pause on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current && videoSectionRef.current && isVideoPlaying) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVideoPlaying]);

  const handleVideoClick = () => {
    if (isVideoPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsVideoPlaying(false);
    } else {
      setIsVideoPlaying(true);
    }
  };

  // Handle walk through video scroll pause
  useEffect(() => {
    const handleWalkThroughScroll = () => {
      if (walkThroughVideoRef.current && walkThroughSectionRef.current && isWalkThroughPlaying) {
        const rect = walkThroughSectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) {
          walkThroughVideoRef.current.pause();
          setIsWalkThroughPlaying(false);
        }
      }
    };

    window.addEventListener("scroll", handleWalkThroughScroll);
    return () => window.removeEventListener("scroll", handleWalkThroughScroll);
  }, [isWalkThroughPlaying]);

  const handleWalkThroughClick = () => {
    if (isWalkThroughPlaying) {
      if (walkThroughVideoRef.current) {
        walkThroughVideoRef.current.pause();
      }
      setIsWalkThroughPlaying(false);
    } else {
      setIsWalkThroughPlaying(true);
    }
  };

  // All gallery images for popup
  const allGalleryImages = [
    "/images/gallery-1.png",
    "/images/gallery-2.png",
    "/images/gallery-3.png",
    "/images/gallery-4.png",
    "/images/gallery-5.png",
    "/images/gallery-6.png",
    "/images/gallery-7.png",
    "/images/gallery-8.png",
    "/images/gallery-9.png",
    "/images/gallery-10.png",
    "/images/gallery-11.png",
    "/images/gallery-12.png",
  ];

  const openMainGallery = (index: number) => {
    setMainGalleryIndex(index);
    setMainGalleryOpen(true);
  };

  const nextMainGalleryImage = () => {
    setMainGalleryIndex((prev) => (prev + 1) % allGalleryImages.length);
  };

  const prevMainGalleryImage = () => {
    setMainGalleryIndex((prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length);
  };

  // Floor plan images for slider
  const floorPlanImages = [
    { src: "/images/floor-plan-1.png", alt: "Floor Plan - Towers A & B" },
    { src: "/images/floor-plan-2.png", alt: "Floor Plan - Tower C" },
    { src: "/images/floor-plan-3.png", alt: "Floor Plan - Tower D" },
  ];

  const nextFloorPlan = () => {
    setFloorPlanSlide((prev) => (prev + 1) % Math.max(1, floorPlanImages.length - 2));
  };

  const prevFloorPlan = () => {
    setFloorPlanSlide((prev) => (prev - 1 + Math.max(1, floorPlanImages.length - 2)) % Math.max(1, floorPlanImages.length - 2));
  };

  // Fallback amenities data when database has no data
  const fallbackAmenities = [
    { name: "TRANQUIL AMENITIES", image: "/images/gallery-1.png", galleryImages: ["/images/gallery-1.png", "/images/gallery-2.png", "/images/gallery-3.png", "/images/gallery-4.png"] },
    { name: "PRACTICAL LUXURY", image: "/images/gallery-2.png", galleryImages: ["/images/gallery-2.png", "/images/gallery-1.png", "/images/gallery-3.png", "/images/gallery-4.png"] },
    { name: "ACTIVE AMENITIES", image: "/images/gallery-3.png", galleryImages: ["/images/gallery-3.png", "/images/gallery-1.png", "/images/gallery-2.png", "/images/gallery-4.png"] },
    { name: "KIDS' sensory", image: "/images/gallery-4.png", galleryImages: ["/images/gallery-4.png", "/images/gallery-1.png", "/images/gallery-2.png", "/images/gallery-3.png"] },
    { name: "Fitness/Gym", image: "/images/amenities-5.png", galleryImages: ["/images/amenities-5.png", "/images/amenities-6.png", "/images/amenities-7.png"] },
    { name: "Indoor games", image: "/images/amenities-7.png", galleryImages: ["/images/amenities-7.png", "/images/amenities-5.png", "/images/amenities-6.png"] },
    { name: "IndoorBadminton", image: "/images/amenities-6.png", galleryImages: ["/images/amenities-6.png", "/images/amenities-7.png", "/images/amenities-5.png"] },
    { name: "Saloon", image: "/images/amenities-8.png", galleryImages: ["/images/amenities-8.png", "/images/amenities-5.png", "/images/amenities-6.png"] },
    { name: "Community Hall", image: "/images/amenities-8.png", galleryImages: ["/images/amenities-8.png", "/images/amenities-9.png", "/images/amenities-10.png"] },
    { name: "CoworkingSpace", image: "/images/amenities-10.png", galleryImages: ["/images/amenities-10.png", "/images/amenities-8.png", "/images/amenities-9.png"] },
    { name: "Kids Play Area", image: "/images/amenities-9.png", galleryImages: ["/images/amenities-9.png", "/images/amenities-10.png", "/images/amenities-11.png"] },
    { name: "YOGA & FITNESS ROOM", image: "/images/amenities-11.png", galleryImages: ["/images/amenities-11.png", "/images/amenities-12.png", "/images/amenities-9.png"] },
  ];

  // Use database amenities or fallback
  const amenitiesData = amenities.length > 0 
    ? amenities.map(a => ({ name: a.name, image: a.image, galleryImages: a.galleryImages }))
    : fallbackAmenities;

  useEffect(() => {
    async function loadData() {
      // Load projects using getProjects (which has proper permissions) and find by id
      try {
        const allProjects = await getProjects();
        const foundProject = allProjects.find(p => p.id === projectId);
        if (foundProject) {
          setProject(foundProject);
        }
      } catch (error) {
        // Silently fail - will use fallback data
      }

      // Try loading property details - may fail if collection doesn't exist or no permissions
      try {
        const detailsData = await getPropertyDetails(projectId);
        setPropertyDetails(detailsData);
      } catch (error) {
        // Silently fail - will use fallback data
      }

      // Try loading amenities - may fail if collection doesn't exist or no permissions
      try {
        const amenitiesData = await getPropertyAmenities(projectId);
        setAmenities(amenitiesData);
      } catch (error) {
        // Silently fail - will use fallback data
      }

      setLoading(false);
    }
    
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  const openGallery = (amenityIndex: number) => {
    setActiveAmenity(amenityIndex);
    setGalleryIndex(0);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setActiveAmenity(null);
  };

  const nextImage = () => {
    if (activeAmenity !== null) {
      const images = amenitiesData[activeAmenity].galleryImages;
      setGalleryIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (activeAmenity !== null) {
      const images = amenitiesData[activeAmenity].galleryImages;
      setGalleryIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // Use database data or fallback to defaults
  const property = {
    ...defaultProperty,
    id: project?.id || defaultProperty.id,
    title: project?.title || defaultProperty.title,
    tagline: propertyDetails?.tagline || defaultProperty.tagline,
    price: propertyDetails?.price || defaultProperty.price,
    priceLabel: propertyDetails?.priceLabel || defaultProperty.priceLabel,
    reraNumber: propertyDetails?.reraNumber || defaultProperty.reraNumber,
    location: project?.location || defaultProperty.location,
    heroImage: propertyDetails?.heroImage || defaultProperty.heroImage,
    about: propertyDetails?.about || defaultProperty.about,
    stats: propertyDetails?.stats || defaultProperty.stats,
    projectStatusVideo: propertyDetails?.videoUrl || defaultProperty.projectStatusVideo,
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const specCategories = [
    { id: "structure", label: "Foundation &", sublabel: "Structural Frame" },
    { id: "walls", label: "Walls" },
    { id: "floor-height", label: "Floor to Floor Height" },
    { id: "interior", label: "Interior Finishes" },
    { id: "doors", label: "Flooring & Cladding" },
    { id: "plumbing", label: "Plumbing & Fittings" },
    { id: "electrical", label: "Electrical" },
    { id: "balcony", label: "Balcony Railing" },
    { id: "performance", label: "Performance" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F2A54]" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[400px] md:h-[550px]">
        <Image
          src={property.heroImage || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1200px] mx-auto px-4 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
              {/* Left Content */}
              <div className="flex-1 min-w-0">
                <h1 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white leading-tight mb-4 md:mb-6">
                  YOUR HOME TO LIVE<br />
                  YOUR LIFE AT ITS BEST
                </h1>
                
                {/* Price Card */}
                <div className="bg-white rounded-lg shadow-lg p-3 md:p-4 inline-flex items-center gap-3 md:gap-4 max-w-full">
                  <div className="border-r border-gray-300 pr-3 md:pr-4 flex-shrink-0">
                    <span className="text-gray-600 text-xs md:text-sm">Price:</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#1F2A54] font-bold text-lg sm:text-xl md:text-3xl truncate">START AT {property.price}*</p>
                    <p className="text-gray-500 text-xs">*T&C APPLY</p>
                  </div>
                </div>
              </div>

              {/* Right - Property Info (hidden on very small screens, shown as column on mobile) */}
              <div className="flex-1 min-w-0 flex flex-col items-start md:items-end text-left md:text-right">
                <h3 className="font-bold text-white text-base md:text-xl mb-1">
                  Luxurious 2, 3, 4 BHK & Duplex Residences
                </h3>
                <p className="text-[#DDA21A] text-sm md:text-lg mb-3 md:mb-4">Range: 1296 to 7619 sq. ft.</p>
                
                {/* Status Badge */}
                <div className="bg-[#DDA21A] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-medium text-sm md:text-base mb-3 md:mb-4">
                  Status: Under Construction
                </div>
                
                {/* Location Badge */}
                <div className="bg-black rounded-lg px-3 md:px-4 py-2 md:py-3 mb-3 md:mb-4 max-w-full">
                  <div className="flex items-center gap-2 text-white">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-[#DDA21A] rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm md:text-lg">TukkuGuda</p>
                      <p className="text-xs text-white/80 truncate">12 Min from Rajivgandi international Airport</p>
                    </div>
                  </div>
                </div>
                
                {/* Phone Number */}
                <p className="text-white font-bold text-sm md:text-lg break-all">
                  P02400001822/89627/5784
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section 
        className="py-12 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/overview-bg.png')`,
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-center">
            {/* Row 1 */}
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">Total Land Area</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.totalLandArea}</p>
            </div>
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">No.of Blocks</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.noOfBlocks}</p>
            </div>
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">Total Unites</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.totalUnits}</p>
            </div>
            {/* Row 2 */}
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">Configuration</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.configuration}</p>
            </div>
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">Floors</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.floors}</p>
            </div>
            <div>
              <p className="text-[#1F2A54] font-bold text-base mb-1">Possessions Starts</p>
              <p className="text-[#1F2A54] text-lg">{property.stats.possessionStarts}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs - CSS sticky positioning below header */}
      <div 
        className="bg-white border-b border-gray-200 sticky top-[72px] md:top-[100px] z-40 shadow-sm"
      >
        <div className="max-w-[1200px] mx-auto px-2 md:px-4 py-2 md:py-4">
          <div className="-mx-2 px-2 overflow-x-auto mt-2 md:mt-4 pt-2 pb-2" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <nav className="flex items-center gap-4 md:gap-8 min-w-max mx-auto w-fit">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200 px-1 py-1 ${
                    activeTab === tab.id
                      ? "text-[#1F2A54] border-b-2 border-[#1F2A54]"
                      : "text-[#1F2A54] hover:text-[#DDA21A]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* About Project */}
      <section id="overview" className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left Content - 65% width */}
            <div className="md:w-[65%]">
              <h2 className="font-bold text-2xl md:text-3xl text-[#1F2A54] mb-6 inline-block">
                ABOUT PROJECT
                <span className="block w-16 h-0.5 bg-[#DDA21A] mt-2"></span>
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4 text-justify">
                <p>
                  Urvy Skyline rises as a refined luxury address in Neopolis — Hyderabad's most promising and future-forward urban destination. Thoughtfully designed as an elegant high-rise development, the project offers spacious 4 BHK residences with grand layouts, premium finishes, and generous ceiling heights that enhance light, air, and a true sense of openness.
                </p>
                <p>
                  Set within a meticulously planned 2.9-acre enclave, Urvy Skyline balances urban sophistication with serene living through well-crafted open spaces, elevated lifestyle zones, panoramic viewing decks, and a contemporary luxury clubhouse. Its prime location ensures seamless connectivity to the Financial District, major IT corridors, and the ORR, positioning it as both a coveted home and a smart investment. Urvy Skyline embodies modern vertical living — where intelligent design, inspiring views, and Neopolis' rising potential come together to define a new benchmark in luxury living.
                </p>
              </div>
            </div>
            {/* Right Image - 35% width */}
            <div className="md:w-[35%]">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/about-project.png"
                  alt="About Project"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-bold text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Project Amenities
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            xplore enviable fashion with opulent amenities at this gated community in Hitec City, designed to make your lifestyle reach a new echelon.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {amenitiesData.map((amenity, index) => {
              const isHovered = hoveredAmenity === index;
              return (
                <div 
                  key={index} 
                  className="relative h-[140px] sm:h-[180px] rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => openGallery(index)}
                  onMouseEnter={() => setHoveredAmenity(index)}
                  onMouseLeave={() => setHoveredAmenity(null)}
                >
                  <Image
                    src={amenity.image || "/placeholder.svg"}
                    alt={amenity.name}
                    fill
                    className={`object-cover transition-all duration-500 ${isHovered ? "scale-105" : "grayscale"}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Expand icon - appears on hover */}
                  <div 
                    className={`absolute top-3 right-3 w-8 h-8 bg-[#DDA21A] rounded-md flex items-center justify-center transition-all duration-300 ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="2" 
                      className="w-4 h-4"
                    >
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm">{amenity.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Popup Modal */}
      {galleryOpen && activeAmenity !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button 
            onClick={closeGallery}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button 
            onClick={prevImage}
            className="absolute left-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image */}
          <div className="relative w-full max-w-4xl h-[70vh] mx-4">
            <Image
              src={amenitiesData[activeAmenity].galleryImages[galleryIndex] || "/placeholder.svg"}
              alt={amenitiesData[activeAmenity].name}
              fill
              className="object-contain"
            />
          </div>

          {/* Next Button */}
          <button 
            onClick={nextImage}
            className="absolute right-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Title and Counter */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <h3 className="text-white text-xl font-semibold mb-2">{amenitiesData[activeAmenity].name}</h3>
            <p className="text-white/70">{galleryIndex + 1} / {amenitiesData[activeAmenity].galleryImages.length}</p>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {amenitiesData[activeAmenity].galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setGalleryIndex(idx)}
                className={`relative w-16 h-12 rounded overflow-hidden border-2 ${galleryIndex === idx ? "border-[#DDA21A]" : "border-transparent"}`}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floor Plans */}
      <section id="floor-plan" className="py-16 bg-[#E8F4FA]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-medium text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Project Plans
          </h2>
          <p className="text-center text-[#cccccc] mb-8 max-w-3xl mx-auto">
            The architectural finesse that emits glamour and allurement. The 2, 3, 4 BHK apartments in Hitec City and duplex homes in Hyderabad
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10">
            <Button
              onClick={() => setActivePlanType("master")}
              className={`px-6 py-2.5 rounded-[5px] font-medium transition-all duration-300 ${
                activePlanType === "master"
                  ? "bg-[#000000] text-[#ffffff] hover:bg-[#000000]"
                  : "bg-[#DDA21A] text-[#1F2A54] hover:bg-[#c4910f]"
              }`}
            >
              Master Plan
            </Button>
            <Button
              onClick={() => setActivePlanType("satellite")}
              className={`px-6 py-2.5 rounded-[5px] font-medium transition-all duration-300 ${
                activePlanType === "satellite"
                  ? "bg-[#000000] text-[#ffffff] hover:bg-[#000000]"
                  : "bg-[#DDA21A] text-[#1F2A54] hover:bg-[#c4910f]"
              }`}
            >
              Location Map
            </Button>
            <Button
              onClick={() => setActivePlanType("floor")}
              className={`px-6 py-2.5 rounded-[5px] font-medium transition-all duration-300 ${
                activePlanType === "floor"
                  ? "bg-[#000000] text-[#ffffff] hover:bg-[#000000]"
                  : "bg-[#DDA21A] text-[#1F2A54] hover:bg-[#c4910f]"
              }`}
            >
              Floor plan
            </Button>
          </div>
          
          <div className="relative">
            {/* Left Arrow */}
            <button 
              onClick={prevFloorPlan}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              aria-label="Previous"
            >
              <Image
                src="/images/left-arrow.png"
                alt="Previous"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </button>
            
            {/* Floor Plan Images Slider */}
            <div className="overflow-hidden px-8">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${floorPlanSlide * (100 / 3 + 2)}%)` }}
              >
                {floorPlanImages.map((plan, index) => (
                  <div 
                    key={index} 
                    className="relative h-[200px] sm:h-[280px] md:h-[320px] rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
                    style={{ width: 'min(calc(33.333% - 16px), 300px)', minWidth: '200px' }}
                  >
                    <Image
                      src={plan.src || "/placeholder.svg"}
                      alt={plan.alt}
                      fill
                      className="object-contain transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Arrow */}
            <button 
              onClick={nextFloorPlan}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              aria-label="Next"
            >
              <Image
                src="/images/right-arrow.png"
                alt="Next"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-medium text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Galllary
          </h2>
          <p className="text-center text-[#666666] mb-10 max-w-3xl mx-auto">
            Swipe your fingers to explore our dynamic spaces. The value we bring with our inspired spaces in this landmark residential project in Hyderabad is astounding.
          </p>
          
          {/* Gallery Grid - 3 rows x 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allGalleryImages.map((src, index) => (
              <div 
                key={`gallery-${index}`} 
                className="relative h-[180px] rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openMainGallery(index)}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Near By Location */}
      <section id="location" className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Near By urvi skyline
          </h2>
          <p className="text-center text-[#666666] text-sm mb-10 max-w-3xl mx-auto">
            Swipe your fingers to explore our dynamic spaces. The value we bring with our inspired spaces in this landmark residential project in Hyderabad is astounding.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            {/* Left Side - 40% */}
            <div className="w-full md:w-[40%] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-[#1F2A54] font-bold text-base mb-2">
                    Hospitals
                  </h3>
                  {property.nearbyPlaces.hospitals.map((place, i) => (
                    <div key={i} className="flex justify-between text-[#666666] text-sm py-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[#666666]">•</span>
                        {place.name}
                      </span>
                      <span className="text-[#666666]">{place.distance}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-[#1F2A54] font-bold text-base mb-2">
                    Schools & Colleges
                  </h3>
                  {property.nearbyPlaces.schools.map((place, i) => (
                    <div key={i} className="flex justify-between text-[#666666] text-sm py-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[#666666]">•</span>
                        {place.name}
                      </span>
                      <span className="text-[#666666]">{place.distance}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-[#1F2A54] font-bold text-base mb-2">
                    IT & Business Hubs
                  </h3>
                  {property.nearbyPlaces.itParks.map((place, i) => (
                    <div key={i} className="flex justify-between text-[#666666] text-sm py-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[#666666]">•</span>
                        {place.name}
                      </span>
                      <span className="text-[#666666]">{place.distance}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-[#1F2A54] font-bold text-base mb-2">
                    Road Connectivity
                  </h3>
                  {property.nearbyPlaces.connectivity.map((place, i) => (
                    <div key={i} className="flex justify-between text-[#666666] text-sm py-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[#666666]">•</span>
                        {place.name}
                      </span>
                      <span className="text-[#666666]">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Side - 60% */}
            <div className="w-full md:w-[60%] relative min-h-[550px] rounded-2xl overflow-hidden bg-[#E8E8E8] border border-gray-100">
              <Image
                src="/images/location-map.png"
                alt="Location Map - Near By urvi skyline"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Status */}
      <section 
        id="project-status" 
        ref={videoSectionRef}
        className="py-16 relative min-h-[600px]"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/project-status-bg.png"
            alt="Project Status Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-white text-center mb-4">
            Project Status
          </h2>
          <p className="text-center text-white/80 mb-10 max-w-3xl mx-auto">
            Swipe your fingers to explore our dynamic spaces. The value we bring with our inspired spaces in this landmark residential project in Hyderabad is astounding.
          </p>
          
          <div 
            className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm cursor-pointer"
            onClick={handleVideoClick}
          >
            {/* Video Element - only render if playing and has valid video source */}
            {isVideoPlaying && (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                onEnded={() => setIsVideoPlaying(false)}
                onError={() => setIsVideoPlaying(false)}
              >
                <source src="/videos/project-status.mp4" type="video/mp4" />
              </video>
            )}
            
            {/* Thumbnail overlay when not playing */}
            {!isVideoPlaying && (
              <div className="absolute inset-0">
                <Image
                  src="/images/video-thumb.png"
                  alt="Project Status"
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 hover:scale-110 transition-transform">
                    <Image
                      src="/images/play-button.png"
                      alt="Play Video"
                      width={80}
                      height={80}
                      className="w-full h-full"
                    />
                  </button>
                </div>
              </div>
            )}
            
            {/* Pause overlay when playing */}
            {isVideoPlaying && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <button className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-8 bg-[#1F2A54] rounded-sm" />
                    <div className="w-2 h-8 bg-[#1F2A54] rounded-sm" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section id="specifications" className="py-16 bg-[#F5F5F5]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Project Specifications
          </h2>
          <p className="text-center text-[#666666] text-sm mb-10 max-w-3xl mx-auto">
            Have a glance at our project specifications — a blueprint for a concise roadmap with desired outcomes, tailored for discerning buyers of new residential projects in Hyderabad.
          </p>
          
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Tabs */}
            <div className="w-full md:w-[35%] pr-0 md:pr-8 border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0">
              <div className="flex flex-wrap md:flex-col gap-1 md:gap-0 md:space-y-1">
                {specificationTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSpecTab(tab.id)}
                    className={`w-full text-left py-2 flex items-start gap-2 transition-colors ${
                      activeSpecTab === tab.id ? "text-[#DDA21A]" : "text-[#1F2A54]"
                    }`}
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-current flex-shrink-0" />
                    <span className="font-medium text-sm">
                      {tab.label}
                      {tab.sublabel && <span className="block">{tab.sublabel}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right Side - Content */}
            <div className="w-full md:w-[65%] pl-0 md:pl-8 mt-8 md:mt-0">
              {property.specifications[activeSpecTab as keyof typeof property.specifications] && (
                <div className="space-y-6">
                  {(property.specifications[activeSpecTab as keyof typeof property.specifications] as { title: string; items: { title: string; details: string[] }[] }).items.map((item, index) => (
                    <div key={index}>
                      <h4 className="text-[#666666] text-lg mb-2">{item.title}</h4>
                      <ul className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <li key={idx} className="text-[#666666] text-sm flex items-start gap-2">
                            <span className="mt-1.5">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Walk Through */}
      <section 
        id="walkthrough" 
        ref={walkThroughSectionRef}
        className="py-16 bg-white"
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-[#1F2A54] text-center mb-4">
            Project walk thourgh
          </h2>
          <p className="text-center text-[#666666] text-sm mb-10 max-w-3xl mx-auto">
            Have a glance at our project specifications — a blueprint for a concise roadmap with desired outcomes, tailored for discerning buyers of new residential projects in Hyderabad.
          </p>
          
          <div 
            className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden cursor-pointer"
            onClick={handleWalkThroughClick}
          >
            {/* Video Element - only render if playing */}
            {isWalkThroughPlaying && (
              <video
                ref={walkThroughVideoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                onEnded={() => setIsWalkThroughPlaying(false)}
                onError={() => setIsWalkThroughPlaying(false)}
              >
                <source src="/videos/walk-through.mp4" type="video/mp4" />
              </video>
            )}
            
            {/* Thumbnail overlay when not playing */}
            {!isWalkThroughPlaying && (
              <div className="absolute inset-0">
                <Image
                  src="/images/walk-through-thumb.png"
                  alt="Walk Through"
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 hover:scale-110 transition-transform">
                    <Image
                      src="/images/play-button.png"
                      alt="Play Video"
                      width={80}
                      height={80}
                      className="w-full h-full"
                    />
                  </button>
                </div>
              </div>
            )}
            
            {/* Pause overlay when playing */}
            {isWalkThroughPlaying && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <button className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-2 h-8 bg-[#1F2A54] rounded-sm" />
                    <div className="w-2 h-8 bg-[#1F2A54] rounded-sm" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Main Gallery Popup Modal */}
      {mainGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setMainGalleryOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevMainGalleryImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Main Image */}
          <div className="relative w-full max-w-4xl h-[70vh] mx-4 md:mx-16">
            <Image
              src={allGalleryImages[mainGalleryIndex] || "/placeholder.svg"}
              alt={`Gallery ${mainGalleryIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextMainGalleryImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-2">
            {allGalleryImages.map((src, index) => (
              <button
                key={index}
                onClick={() => setMainGalleryIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  index === mainGalleryIndex ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {mainGalleryIndex + 1} / {allGalleryImages.length}
          </div>
        </div>
      )}
    </main>
  );
}
