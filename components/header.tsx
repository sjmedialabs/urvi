"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryModal } from "@/components/enquiry-modal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/apartments", label: "Apartments" },
  { href: "/villas", label: "Villas" },
  { href: "/commercial", label: "Commercial" },
  { href: "/plots", label: "Plots" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex flex-col items-center">
          {/* Logo - Centered */}
          <div className="pt-4 pb-2">
            <Link href="/">
              <Image
                src="/images/urvi-logo-header.png"
                alt="Urvi Constructions"
                width={120}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Row - Centered with button as part of menu */}
          <div className="w-full flex items-center justify-center pb-4">
            <nav className="flex items-center justify-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 nav-hover cursor-pointer relative pb-1 ${
                    isActive(link.href)
                      ? "text-[#DDA21A] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#DDA21A]"
                      : isScrolled
                        ? "text-[#1F2A54] hover:text-[#DDA21A]"
                        : "text-white hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="font-medium px-6 py-2 rounded-md bg-[#1F2A54] hover:bg-[#1F2A54]/90 text-white ml-4 btn-hover-lift cursor-pointer transition-all duration-300"
                onClick={() => setIsEnquiryOpen(true)}
              >
                Enquiry Now
              </Button>
            </nav>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Mobile Header - Logo centered, hamburger on right */}
          <div className="flex items-center justify-center py-4 relative">
            <Link href="/">
              <Image
                src="/images/urvi-logo-header.png"
                alt="Urvi Constructions"
                width={100}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            
            <button
              type="button"
              className={`absolute right-0 p-2 transition-all duration-300 ${
                isScrolled ? "text-[#1F2A54]" : "text-white"
              } ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            } ${isScrolled ? "bg-white" : "bg-[#1F2A54]/95"}`}
          >
            <nav className="flex flex-col items-center gap-1 pb-4">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm transition-all duration-200 text-center w-full hover:bg-white/10 ${
                    isActive(link.href)
                      ? "text-[#DDA21A] font-semibold"
                      : isScrolled
                        ? "text-[#1F2A54] hover:text-[#DDA21A] hover:bg-[#1F2A54]/5"
                        : "text-white hover:text-gold"
                  }`}
                  style={{ transitionDelay: mobileMenuOpen ? `${index * 30}ms` : "0ms" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                className="font-medium mt-2 bg-[#DDA21A] hover:bg-[#c99218] text-[#1F2A54] w-[80%] transition-all duration-300"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsEnquiryOpen(true);
                }}
              >
                Enquiry Now
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </header>
  );
}
