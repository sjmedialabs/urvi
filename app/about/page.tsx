"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order: number;
}

interface AboutPageContent {
  heroTitle: string;
  heroImage: string;
  tagline: string;
  introText: string;
  description: string;
  missionTitle: string;
  missionText: string;
  missionIcon: string;
  visionTitle: string;
  visionText: string;
  visionIcon: string;
  leadersTitle: string;
  leadersSubtitle: string;
  teamMembers: TeamMember[];
}

const defaultContent: AboutPageContent = {
  heroTitle: "CREATING VALUE THROUGH INNOVATION",
  heroImage: "/images/about/hero-boardroom.png",
  tagline: "Quality.\nPrecision.\nPerformance.",
  introText: "We'd love to share more with you, please complete this form and our dedicated team will get back to you shortly.",
  description: "At Urvi Constructions, we are committed to delivering projects that exemplify superior quality, thoughtful innovation, and meticulous planning. We believe in building lasting relationships with our clients by consistently exceeding expectations and earning their trust at every stage. Our goal is to emerge as a leader in the real estate space by creating landmark developments that redefine luxury across residential and commercial environments. Through future-ready residential, commercial, and IT park projects, we strive to set new benchmarks in design excellence, functionality, and customer satisfaction.",
  missionTitle: "Our Mission",
  missionText: "At Urvi Constructions, our mission is to redefine residential living through thoughtful innovation and inspired design. We are driven to execute every project with precision and timeliness, delivering homes that reflect superior quality, enduring value, and refined aesthetics—without compromise.",
  missionIcon: "/images/icons/mission-icon.png",
  visionTitle: "Our Vision",
  visionText: "At Urvi Constructions, our mission is to redefine residential living through thoughtful innovation and inspired design. We are driven to execute every project with precision and timeliness, delivering homes that reflect superior quality, enduring value, and refined aesthetics—without compromise.",
  visionIcon: "/images/icons/vision-icon.png",
  leadersTitle: "OUR LEADERS",
  leadersSubtitle: "MEET THE VISIONARIES BEHIND THE ALIENS GROUP",
  teamMembers: [
    { id: "1", name: "Hari Challa", role: "Managing Director", image: "/images/team/leader-1.png", order: 1 },
    { id: "2", name: "Raghu ram Reddy", role: "Managing Director", image: "/images/team/leader-2.png", order: 2 },
    { id: "3", name: "Harini Choudary", role: "Joint Director", image: "/images/team/leader-3.png", order: 3 },
    { id: "4", name: "Prathush reddy", role: "Managing Director", image: "/images/team/leader-4.png", order: 4 },
  ],
};

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/v1/content/about");
        const json = await res.json().catch(() => ({}));
        if (res.ok && json?.data) {
          setContent({ ...defaultContent, ...json.data });
        }
      } catch (error) {
        console.error("Error fetching about page content:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContent();
  }, []);

  const sortedTeam = [...content.teamMembers].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px]">
        <Image
          src={content.heroImage}
          alt="Urvi Constructions Boardroom"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="inner-hero-title font-royal text-white tracking-[0.2em] text-center">
            {content.heroTitle}
          </h1>
        </div>
      </section>

      {/* Quality Section */}
      <section 
        className="py-16 md:py-24 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/images/about/about-bg.png')" }}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">
            {/* Left - Tagline */}
            <div className="md:w-[35%]">
              <h2 className="font-serif text-[40px] leading-[1.2] text-[#1F2A54]">
                {content.tagline.split("\n").map((line, i) => (
                  <span key={i}>{line}{i < content.tagline.split("\n").length - 1 && <br />}</span>
                ))}
              </h2>
            </div>
            
            {/* Right - Description */}
            <div className="md:w-[65%] space-y-6">
              <p className="text-[#1F2A54] text-base font-semibold leading-relaxed">
                {content.introText}
              </p>
              <p className="text-[#6B7280] text-sm leading-[1.8]">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-[#1F2A54] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            {/* Our Mission */}
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6">
                <Image
                  src={content.missionIcon}
                  alt="Our Mission"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="font-royal text-2xl md:text-3xl text-gold mb-4">{content.missionTitle}</h3>
              <p className="text-white/80 leading-relaxed">
                {content.missionText}
              </p>
            </div>
            
            {/* Our Vision */}
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-6">
                <Image
                  src={content.visionIcon}
                  alt="Our Vision"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h3 className="font-royal text-2xl md:text-3xl text-gold mb-4">{content.visionTitle}</h3>
              <p className="text-white/80 leading-relaxed">
                {content.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Leaders Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#1F2A54] text-sm font-semibold tracking-[0.2em] uppercase mb-2">
              {content.leadersTitle}
            </h2>
            <p className="font-royal text-2xl md:text-3xl text-gold">
              {content.leadersSubtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {sortedTeam.map((member, index) => (
              <div key={member.id || index} className="text-center card-hover-lift">
                <div className="relative w-full aspect-[3/4] mb-4 rounded-2xl overflow-hidden img-hover-zoom">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-royal text-lg md:text-xl text-gold mb-1">
                  {member.name}
                </h4>
                <p className="text-[#6B7280] text-sm">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
