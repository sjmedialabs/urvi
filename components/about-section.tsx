"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
type AboutData = { title?: string; subtitle?: string; description?: string; image?: string; heroTitle?: string; tagline?: string; heroImage?: string };

const propertyTypes = [
  { icon: "/images/icons/apartments.png", label: "Apartments" },
  { icon: "/images/icons/villa.png", label: "Villas" },
  { icon: "/images/icons/townships.png", label: "Townships" },
  { icon: "/images/icons/commercial.png", label: "Commercial" },
];

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/v1/content/about");
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.data) setAboutData(json.data);
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const title = aboutData?.title || aboutData?.heroTitle || "About Urvi Constructions";
  const subtitle = aboutData?.subtitle || aboutData?.tagline || "We Are The Leader In The\nArchitectural";
  const description = aboutData?.description || "At Urvi Constructions, we're driven by a clear purpose -- to redefine how communities are built and experienced. Rooted in integrity, quality, and innovation, our journey is guided by a commitment to create spaces that inspire better living.";
  const aboutImage = aboutData?.image || aboutData?.heroImage || "/images/about-building.jpg";

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div 
            ref={leftRef}
            className={`lg:pt-8 transition-all duration-700 ${
              leftVisible ? 'animate-on-scroll animate-fade-right animate-visible' : 'animate-on-scroll animate-fade-right'
            }`}
          >
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            ) : (
              <>
            <p className="text-[#1F2A54] font-normal mb-3 text-base">{title}</p>
            <h2 className="text-[#1F2A54] text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              {subtitle.split("\n").map((line, i) => (
                <span key={i}>{line}{i < subtitle.split("\n").length - 1 && <br />}</span>
              ))}
            </h2>
            {description.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-[#6B7280] font-normal leading-relaxed mb-4 text-base">
                {paragraph}
              </p>
            ))}
            <div className="mb-6" />
              </>
            )}

            {/* Property Types */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8 mb-10">
              {propertyTypes.map((type, index) => (
                <div 
                  key={type.label} 
                  className="text-center group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                    <Image
                      src={type.icon || "/placeholder.svg"}
                      alt={type.label}
                      width={60}
                      height={60}
                      className="object-contain icon-animate-float group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-[#1F2A54] font-medium">{type.label}</p>
                </div>
              ))}
            </div>

            <button className="inline-flex items-center gap-3 bg-[#DDA21A] hover:bg-[#c99218] text-[#1F2A54] font-semibold px-8 py-3 rounded transition-all duration-300 btn-hover-lift btn-hover-glow cursor-pointer">
              Read More
              <Image
                src="/images/icons/arrow.png"
                alt="Arrow"
                width={16}
                height={16}
                className="object-contain group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Right Image */}
          <div 
            ref={rightRef}
            className={`relative overflow-hidden transition-all duration-700 delay-200 ${
              rightVisible ? 'animate-on-scroll animate-fade-left animate-visible' : 'animate-on-scroll animate-fade-left'
            }`}
          >
            {/* Gray decorative rectangles */}
            <div className="absolute -bottom-6 -left-6 w-32 h-40 bg-[#E5E7EB] -z-10 hidden sm:block" />
            <div className="absolute -bottom-6 right-0 w-48 h-24 bg-[#E5E7EB] -z-10 hidden sm:block" />
            
            {isLoading ? (
              <div className="relative aspect-[4/5] bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="relative aspect-[4/5] overflow-hidden img-hover-zoom">
                <Image
                  src={aboutImage}
                  alt="Modern architectural building"
                  fill
                  className="object-cover transition-transform duration-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
