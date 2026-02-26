"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getHeroSlides, type HeroSlide } from "@/lib/firestore";

export function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch slides from CMS
  useEffect(() => {
    async function fetchSlides() {
      try {
        const cmsSlides = await getHeroSlides();
        setSlides(cmsSlides);
      } catch (error) {
        console.error("Error fetching hero slides:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlides();
  }, []);

  // Auto-advance carousel with pause support
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsPaused(true);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrevious();
    }
    setTouchStart(null);
    setIsPaused(false);
  };

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  if (isLoading) {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1F2A54]">
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="w-full flex flex-col items-center text-center">
            <div className="h-12 w-3/4 max-w-lg bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-8 w-1/2 max-w-md bg-white/10 rounded animate-pulse mb-4" />
            <div className="h-5 w-2/3 max-w-sm bg-white/5 rounded animate-pulse mt-6" />
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#1F2A54]">
        <Image src="/images/hero-bg.jpg" alt="Background" fill className="object-cover opacity-40" />
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="w-full flex flex-col items-center text-center">
            <h1 className="font-royal text-4xl md:text-5xl lg:text-6xl text-gold leading-tight mb-4">
              Welcome to Urvi Constructions
            </h1>
            <p className="font-royal text-white/80 text-lg md:text-xl tracking-wide mt-6">
              Building your dreams into reality
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.backgroundImage || "/images/hero-bg.jpg"}
            alt={slide.headline}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="w-full flex flex-col items-center text-center">
          {/* Main Headline */}
          <h1 className="font-royal text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 animate-fade-in-up">
            {currentSlideData.headline.split("\n").map((line, i) => (
              <span key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 200}ms` }}>
                <span className={i === 0 ? "text-gold" : "text-white"}>
                  {line}
                </span>
                {i < currentSlideData.headline.split("\n").length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p className="font-royal text-white/80 text-lg md:text-xl tracking-wide mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {currentSlideData.subheadline}
          </p>

          {/* Scroll Indicator */}
          <div className="mt-16 hidden md:block">
            <Link
              href="#about"
              className="inline-flex items-center gap-2 text-white/70 hover:text-gold transition-all duration-300 text-sm cursor-pointer group"
            >
              <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center icon-animate-bounce group-hover:border-gold group-hover:bg-gold/10 transition-all duration-300">
                <ChevronRight className="w-5 h-5 rotate-90" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      {slides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center hover:scale-125 transition-all duration-300 cursor-pointer"
            aria-label="Previous slide"
          >
            <Image
              src="/images/banner-arrow-left.png"
              alt="Previous"
              width={40}
              height={40}
              className="icon-animate-pulse"
            />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center hover:scale-125 transition-all duration-300 cursor-pointer"
            aria-label="Next slide"
          >
            <Image
              src="/images/banner-arrow-right.png"
              alt="Next"
              width={40}
              height={40}
              className="icon-animate-pulse"
            />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                index === currentSlide
                  ? "bg-gold w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
