"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { isValidImageUrl } from "@/lib/media";
import { Reveal } from "@/components/motion/reveal";
import { GsapParallax } from "@/components/motion/gsap-parallax";
import { FloatingOrbs } from "@/components/motion/floating-orbs";
import { Magnetic } from "@/components/motion/magnetic";

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
      <section id="about" className="py-20 bg-white relative overflow-hidden">
        <motion.div
          className="max-w-[1200px] mx-auto px-4 h-64 bg-gray-100 rounded-2xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </section>
    );
  }

  if (!hasContent) return null;

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <FloatingOrbs />
      <div className="max-w-[1200px] mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Reveal direction="right" className="lg:pt-8">
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
                <motion.p
                  key={i}
                  className="text-[#6B7280] font-normal leading-relaxed mb-4 text-base"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6 }}
                >
                  {paragraph}
                </motion.p>
              ))}

            <Magnetic className="inline-block mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 bg-[#DDA21A] hover:bg-[#c99218] text-[#1F2A54] font-semibold px-8 py-3 rounded transition-colors"
              >
                Read More
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
          </Reveal>

          {isValidImageUrl(aboutImage) && (
            <Reveal direction="left" delay={0.15}>
              <GsapParallax speed={0.2} className="relative overflow-hidden rounded-2xl">
                <motion.div
                  className="relative aspect-[4/5] overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <SafeImage
                    src={aboutImage}
                    alt={title || "About Urvi Constructions"}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </GsapParallax>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
