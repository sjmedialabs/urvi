"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getSafeImageSrc, isValidImageUrl } from "@/lib/media";

type WhyUsFeature = { icon?: string; title?: string; description?: string };
type WhyUsContent = {
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
  features?: WhyUsFeature[];
};

export function WhyUsSection() {
  const [content, setContent] = useState<WhyUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/content/pages/home-why-us", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.data) setContent(json.data as WhyUsContent);
      } catch (e) {
        console.error("Why us section load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const features = Array.isArray(content?.features) ? content.features : [];
  const hasContent =
    content &&
    (content.title ||
      content.description ||
      features.length > 0 ||
      isValidImageUrl(content.image));

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (!hasContent) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div
            ref={leftRef}
            className={`transition-all duration-700 ${
              leftVisible ? "animate-on-scroll animate-fade-right animate-visible" : "animate-on-scroll animate-fade-right"
            }`}
          >
            {content?.eyebrow && (
              <p className="text-[#1F2A54] font-medium mb-2">{content.eyebrow}</p>
            )}
            {content?.title && (
              <h2 className="font-extrabold text-3xl md:text-4xl text-[#1F2A54] mb-6 text-balance">
                {content.title}
              </h2>
            )}
            {content?.description && (
              <p className="text-gray-500 leading-relaxed mb-10 max-w-lg whitespace-pre-line">
                {content.description}
              </p>
            )}

            {features.length > 0 && (
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.title ?? String(index)}
                    className="flex items-center gap-6 p-5 bg-[#F8F8F8] rounded-lg"
                  >
                    <div className="flex-shrink-0 w-[84px] h-[84px] bg-[#1F2A54] rounded-full flex items-center justify-center p-5">
                      {isValidImageUrl(feature.icon) && (
                        <Image
                          src={getSafeImageSrc(feature.icon)}
                          alt={feature.title || ""}
                          width={44}
                          height={44}
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div>
                      {feature.title && (
                        <h3 className="font-bold text-[#1F2A54] text-base mb-1">{feature.title}</h3>
                      )}
                      {feature.description && (
                        <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isValidImageUrl(content?.image) && (
            <div
              ref={rightRef}
              className={`relative w-full h-[500px] lg:h-[600px] transition-all duration-700 delay-200 ${
                rightVisible ? "animate-on-scroll animate-fade-left animate-visible" : "animate-on-scroll animate-fade-left"
              }`}
            >
              <Image
                src={getSafeImageSrc(content.image)}
                alt={content.title || "Why Urvi Constructions"}
                fill
                className="object-contain object-right"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
