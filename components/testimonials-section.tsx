"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
interface TestimonialDisplay {
  id: string;
  name: string;
  role: string;
  image: string;
  text: string;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation<HTMLDivElement>();

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch("/api/v1/testimonials/public");
        const json = await res.json().catch(() => ({}));
        const list = Array.isArray(json?.data) ? json.data : [];
        const mapped: TestimonialDisplay[] = list.map((t: Record<string, unknown>) => ({
          id: String(t?.id ?? Math.random()),
          name: String(t?.name ?? ""),
          role: String(t?.role ?? ""),
          image: String(t?.image ?? ""),
          text: String(t?.content ?? ""),
        }));
        setTestimonials(mapped);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setStartIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setStartIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Get visible testimonials (2 at a time)
  const getVisibleTestimonials = () => {
    if (testimonials.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(2, testimonials.length); i++) {
      const index = (startIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTouchStart(null);
  };

  return (
    <section 
      className="py-20 relative"
      style={{
        backgroundImage: "url('/images/testimonials-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'animate-on-scroll animate-fade-up animate-visible' : 'animate-on-scroll animate-fade-up'
          }`}
        >
          <p className="text-[#ffffff] font-medium mb-2">Feedback</p>
          <h2 className="font-extrabold text-3xl md:text-4xl text-[#ffffff]">
            Our Testimonials
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-12">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/20 rounded-2xl h-48 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/60 text-lg">No testimonials available yet.</p>
          </div>
        )}

        {/* Testimonials Carousel */}
        {!isLoading && testimonials.length > 0 && (
          <div className="max-w-[1200px] mx-auto relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden md:flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
              aria-label="Previous testimonial"
            >
              <Image
                src="/images/icons/left-arrow-projects.png"
                alt="Previous"
                width={48}
                height={48}
                className="object-contain"
              />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 hidden md:flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
              aria-label="Next testimonial"
            >
              <Image
                src="/images/icons/right-arrow-projects.png"
                alt="Next"
                width={48}
                height={48}
                className="object-contain"
              />
            </button>

            {/* Testimonial Cards */}
            <div 
              ref={cardsRef}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-12 transition-all duration-700 delay-200 ${
                cardsVisible ? 'animate-on-scroll animate-fade-up animate-visible' : 'animate-on-scroll animate-fade-up'
              }`}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-2xl p-8 pt-14 relative shadow-lg card-hover-lift transition-all duration-300"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* User Photo - Positioned at top, overlapping card */}
                  <div className="absolute -top-10 left-8 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Quote Icon */}
                  <div className="absolute top-6 right-8">
                    <Image
                      src="/images/icons/quotes.png"
                      alt="Quote"
                      width={32}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  
                  {/* Author Info */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-[#1F2A54] text-lg">
                      {testimonial.name} <span className="font-normal text-sm text-gray-500">/ {testimonial.role}</span>
                    </h4>
                  </div>
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {testimonial.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Button className="bg-[#DDA21A] hover:bg-[#c99318] text-white px-8 py-6 rounded-full text-base font-medium btn-hover-lift btn-hover-glow cursor-pointer transition-all duration-300">
                See All Testimonials <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
