"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { isValidImageUrl } from "@/lib/media";

type VideoContent = {
  title?: string;
  videoUrl?: string;
  posterImage?: string;
};

export function VideoSection() {
  const [content, setContent] = useState<VideoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { ref: animRef, isVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/content/pages/home-video", { cache: "no-store" });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.data) setContent(json.data as VideoContent);
      } catch (e) {
        console.error("Video section load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isPlaying]);

  const videoUrl = content?.videoUrl?.trim();
  const hasVideo = Boolean(videoUrl);

  if (loading) {
    return (
      <section className="relative h-[400px] md:h-[500px] bg-[#1e3a5f]">
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      </section>
    );
  }

  if (!hasVideo && !content?.title && !isValidImageUrl(content?.posterImage)) {
    return null;
  }

  const handlePlayClick = () => {
    if (!videoRef.current || !hasVideo) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const posterStyle = isValidImageUrl(content?.posterImage)
    ? { backgroundImage: `url('${content!.posterImage}')`, backgroundColor: "#1e3a5f" }
    : { backgroundColor: "#1e3a5f" };

  return (
    <section ref={sectionRef} className="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={posterStyle}
      />

      {hasVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
          src={videoUrl}
          playsInline
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}

      <div
        ref={animRef}
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-4 transition-opacity duration-500 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {hasVideo && (
          <button
            type="button"
            onClick={handlePlayClick}
            className={`group w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 hover:bg-white/30 transition-all duration-300 ${
              isVisible ? "animate-on-scroll animate-scale-in animate-visible" : "animate-on-scroll animate-scale-in"
            }`}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-[#1F2A54] fill-[#1F2A54] ml-1" />
            </div>
          </button>
        )}

        {content?.title && (
          <h2
            className={`font-royal text-2xl md:text-4xl lg:text-5xl text-white font-medium text-balance transition-all duration-700 ${
              isVisible ? "animate-on-scroll animate-fade-up animate-visible animate-delay-200" : "animate-on-scroll animate-fade-up"
            }`}
          >
            {content.title}
          </h2>
        )}
      </div>

      {isPlaying && hasVideo && (
        <button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
          aria-label="Pause video"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </button>
      )}
    </section>
  );
}
