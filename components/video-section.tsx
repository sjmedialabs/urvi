"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { isValidImageUrl } from "@/lib/media";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

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
        <motion.div
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
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
      <motion.div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${
          isPlaying ? "opacity-0" : "opacity-100"
        }`}
        style={posterStyle}
        initial={{ scale: 1.1 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4 }}
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

      <motion.div
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-4 ${
          isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {hasVideo && (
          <Magnetic className="mb-8">
            <motion.button
              type="button"
              onClick={handlePlayClick}
              className="group w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(221,162,26,0.45)",
                  "0 0 0 24px rgba(221,162,26,0)",
                  "0 0 0 0 rgba(221,162,26,0)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity }}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-[#1F2A54] fill-[#1F2A54] ml-1" />
              </div>
            </motion.button>
          </Magnetic>
        )}

        {content?.title && (
          <Reveal direction="up" delay={0.15}>
            <h2 className="font-royal text-2xl md:text-4xl lg:text-5xl text-white font-medium text-balance">
              {content.title}
            </h2>
          </Reveal>
        )}
      </motion.div>

      {isPlaying && hasVideo && (
        <motion.button
          type="button"
          onClick={handlePlayClick}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-label="Pause video"
        >
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.35)" }}
          >
            <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </motion.div>
        </motion.button>
      )}
    </section>
  );
}
