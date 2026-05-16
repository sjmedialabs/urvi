"use client";

import { motion } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { isValidImageUrl } from "@/lib/media";
import { heroText } from "@/lib/motion/variants";

type ListingHeroProps = {
  title?: string;
  image?: string | null;
  loading?: boolean;
  defaultAlt?: string;
};

export function ListingHero({ title, image, loading, defaultAlt = "Page hero" }: ListingHeroProps) {
  if (loading) {
    return (
      <section className="relative h-[280px] md:h-[400px] bg-[#1F2A54] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </section>
    );
  }

  const hasTitle = Boolean(title?.trim());
  const hasImage = isValidImageUrl(image);

  if (!hasTitle && !hasImage) {
    return (
      <motion.section
        className="relative h-[200px] md:h-[280px] bg-gradient-to-r from-[#1F2A54] to-[#2d3f6f]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        aria-hidden
      />
    );
  }

  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      {hasImage ? (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <SafeImage src={image} alt={title || defaultAlt} fill className="object-cover" priority />
        </motion.div>
      ) : (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/80 to-[#1F2A54]/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      {hasImage && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/60 to-[#C9A227]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      )}
      {hasTitle && (
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="inner-hero-title font-royal text-white text-center">
            {title!.split("\n").map((line, i, arr) => (
              <motion.span key={i} custom={i} variants={heroText} initial="hidden" animate="visible">
                {line}
                {i < arr.length - 1 && <br />}
              </motion.span>
            ))}
          </h1>
        </div>
      )}
    </section>
  );
}
