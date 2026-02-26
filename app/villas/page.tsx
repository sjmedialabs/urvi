"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getProjects, Project } from "@/lib/firestore";

const filterTabs = [
  { id: "all", label: "All Projects" },
  { id: "ongoing", label: "On Going Projects" },
  { id: "upcoming", label: "Upcoming projects" },
  { id: "completed", label: "Completed Projects" },
];

const defaultProjects: Project[] = [
  {
    id: "v1",
    title: "Royal Palm Villas",
    location: "Jubilee Hills, Hyderabad",
    category: "villas",
    status: "ongoing",
    image: "/images/project-2.jpg",
    price: "12.50 Cr",
    description: "",
    featured: true,
  },
  {
    id: "v2",
    title: "Sunset Garden Villas",
    location: "Banjara Hills, Hyderabad",
    category: "villas",
    status: "upcoming",
    image: "/images/project-3.jpg",
    price: "15.00 Cr",
    description: "",
    featured: true,
  },
  {
    id: "v3",
    title: "Lake View Luxury Villas",
    location: "Madhapur, Hyderabad",
    category: "villas",
    status: "completed",
    image: "/images/project-1.jpg",
    price: "18.75 Cr",
    description: "",
    featured: false,
  },
];

export default function VillasPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await getProjects();
        const villaProjects = data.filter(p => p.category === "villas");
        if (villaProjects.length > 0) {
          setProjects(villaProjects);
        }
      } catch {
        // Use default projects
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === activeFilter);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px]">
        <Image
          src="/images/video-bg.jpg"
          alt="Villas"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/80 to-[#C9A227]/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="inner-hero-title font-royal text-white text-center">
            PROJECT GALOUR LATEST<br />PROJECTSLARY
          </h1>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="font-royal text-2xl md:text-3xl text-[#1F2A54] text-center mb-8">
            OUR VILLA PROJECTS
          </h2>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                  activeFilter === tab.id
                    ? "bg-[#1F2A54] text-white shadow-md scale-105"
                    : "bg-gray-100 text-[#1F2A54] hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-12">Loading projects...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/property/${project.id}`}
                  className="group block"
                >
                  <div className="relative h-[420px] rounded-[20px] overflow-hidden border border-gray-200 shadow-sm card-hover-lift">
                    <Image
                      src={project.image || "/images/project-2.jpg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-bold text-white text-xl leading-tight mb-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/90 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
