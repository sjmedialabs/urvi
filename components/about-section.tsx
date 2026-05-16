"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { SafeImage } from "@/components/safe-image";
import { isValidImageUrl } from "@/lib/media";

type AboutData = {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  heroTitle?: string;
  tagline?: string;
  heroImage?: string;
};

export function AboutSection() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/v1/content/about", { cache: "no-store" });
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

  const title = aboutData?.title || aboutData?.heroTitle;
  const subtitle = aboutData?.subtitle || aboutData?.tagline;
  const description = aboutData?.description;
  const aboutImage = aboutData?.image || aboutData?.heroImage;

  const hasContent =
    Boolean(title?.trim()) ||
    Boolean(subtitle?.trim()) ||
    Boolean(description?.trim()) ||
    isValidImageUrl(aboutImage);

  if (isLoading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (!hasContent) return null;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div
            ref={leftRef}
            className={`lg:pt-8 transition-all duration-700 ${
              leftVisible ? "animate-on-scroll animate-fade-right animate-visible" : "animate-on-scroll animate-fade-right"
            }`}
          >
            {title && <p className="text-[#1F2A54] font-normal mb-3 text-base">{title}</p>}
            {subtitle && (
              <h2 className="text-[#1F2A54] text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                {subtitle.split("\n").map((line, i, lines) => (
                  <span key={i}>
                    {line}
                    {i < lines.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            )}
            {description &&
              description.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-[#6B7280] font-normal leading-relaxed mb-4 text-base">
                  {paragraph}
                </p>
              ))}

            <Link
              href="/about"
              className="inline-flex items-center gap-3 bg-[#DDA21A] hover:bg-[#c99218] text-[#1F2A54] font-semibold px-8 py-3 rounded transition-all duration-300 mt-4"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isValidImageUrl(aboutImage) && (
            <div
              ref={rightRef}
              className={`relative overflow-hidden transition-all duration-700 delay-200 ${
                rightVisible ? "animate-on-scroll animate-fade-left animate-visible" : "animate-on-scroll animate-fade-left"
              }`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <SafeImage src={aboutImage} alt={title || "About Urvi Constructions"} fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
