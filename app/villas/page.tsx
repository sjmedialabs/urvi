"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Project } from "@/lib/firestore";

const filterTabs = [
  { id: "all", label: "All Projects" },
  { id: "ongoing", label: "On Going Projects" },
  { id: "upcoming", label: "Upcoming projects" },
  { id: "completed", label: "Completed Projects" },
];

export default function VillasPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/v1/projects/public");
        const json = await res.json().catch(() => ({}));
        const list = Array.isArray(json?.data) ? json.data : [];
        const villaProjects = list
          .filter((p: { category?: string }) => p.category === "villas")
          .map((p: Record<string, unknown>) => ({ id: p.id, ...p } as Project));
        setProjects(villaProjects);
      } catch {
        setProjects([]);
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

          {/* Projects Grid - from CMS only */}
          {loading ? (
            <div className="text-center py-12">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No villas projects in CMS yet.</div>
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
                      src={project.image || "/placeholder.svg"}
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
