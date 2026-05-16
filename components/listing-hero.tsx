"use client";

import { SafeImage } from "@/components/safe-image";
import { isValidImageUrl } from "@/lib/media";

type ListingHeroProps = {
  title?: string;
  image?: string | null;
  loading?: boolean;
  defaultAlt?: string;
};

export function ListingHero({ title, image, loading, defaultAlt = "Page hero" }: ListingHeroProps) {
  if (loading) {
    return (
      <section className="relative h-[280px] md:h-[400px] bg-[#1F2A54]">
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      </section>
    );
  }

  const hasTitle = Boolean(title?.trim());
  const hasImage = isValidImageUrl(image);

  if (!hasTitle && !hasImage) {
    return (
      <section className="relative h-[200px] md:h-[280px] bg-gradient-to-r from-[#1F2A54] to-[#2d3f6f]" aria-hidden />
    );
  }

  return (
    <section className="relative h-[400px] md:h-[500px]">
      {hasImage ? (
        <SafeImage src={image} alt={title || defaultAlt} fill className="object-cover" priority />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/80 to-[#1F2A54]/90" />
      )}
      {hasImage && <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/60 to-[#C9A227]/30" />}
      {hasTitle && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="inner-hero-title font-royal text-white text-center">
            {title!.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h1>
        </div>
      )}
    </section>
  );
}
