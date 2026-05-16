"use client";

import Image, { type ImageProps } from "next/image";
import { getSafeImageSrc, isValidImageUrl } from "@/lib/media";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  hideIfEmpty?: boolean;
};

export function SafeImage({ src, alt, hideIfEmpty, className, ...rest }: SafeImageProps) {
  if (hideIfEmpty && !isValidImageUrl(src)) {
    return (
      <div
        className={className}
        style={
          rest.fill
            ? { position: "absolute", inset: 0, backgroundColor: "#E8E8E8" }
            : { backgroundColor: "#E8E8E8" }
        }
        aria-hidden
      />
    );
  }
  return (
    <Image
      src={getSafeImageSrc(src)}
      alt={alt || ""}
      className={className}
      {...rest}
    />
  );
}
