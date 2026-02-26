"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: "/images/icons/corporate-responsibility.png",
    title: "Corporate Responsibility",
    description: "Our goal is zero incidents and our lost time frequency rate is industry leading.",
  },
  {
    icon: "/images/icons/experts-team-spirit.png",
    title: "Experts with Team Spirit",
    description: "Our multi-skilled team provides innovative, forward-thinking solutions.",
  },
  {
    icon: "/images/icons/diversity-inclusion.png",
    title: "Diversity, Equity & Inclusion",
    description: "We work with both investors and developers to create landmarks that make an impact.",
  },
];

export function WhyUsSection() {
  const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div 
            ref={leftRef}
            className={`transition-all duration-700 ${
              leftVisible ? 'animate-on-scroll animate-fade-right animate-visible' : 'animate-on-scroll animate-fade-right'
            }`}
          >
            <p className="text-[#1F2A54] font-medium mb-2">Why Urvi Constructions</p>
            <h2 className="font-extrabold text-3xl md:text-4xl text-[#1F2A54] mb-6 text-balance">
              What makes us Different
            </h2>
            <p className="text-gray-500 leading-relaxed mb-10 max-w-lg">
              It&apos;s not just about creating something good; it&apos;s about designing, innovating, and 
              collaborating to forge remarkable and unparalleled experiences.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div 
                  key={feature.title} 
                  className={`flex items-center gap-6 p-5 bg-[#F8F8F8] rounded-lg group cursor-pointer card-hover-lift transition-all duration-500`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0 w-[84px] h-[84px] bg-[#1F2A54] rounded-full flex items-center justify-center p-5 group-hover:bg-[#DDA21A] transition-colors duration-300">
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.title}
                      width={44}
                      height={44}
                      className="object-contain icon-animate-bounce"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1F2A54] text-base mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Images - Collage */}
          <div 
            ref={rightRef}
            className={`relative w-full h-[500px] lg:h-[600px] transition-all duration-700 delay-200 ${
              rightVisible ? 'animate-on-scroll animate-fade-left animate-visible' : 'animate-on-scroll animate-fade-left'
            }`}
          >
            <Image
              src="/images/why-urvi-collage.png"
              alt="Why Urvi Constructions - Modern interiors and high-rise building"
              fill
              className="object-contain object-right hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
