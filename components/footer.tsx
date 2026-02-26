"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getContactInfo, type ContactInfo } from "@/lib/firestore";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallary" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
];

const discoverLinks = [
  { href: "/apartments", label: "Apartments" },
  { href: "/villas", label: "Villas" },
  { href: "/commercial", label: "Commercial" },
  { href: "/open-plots", label: "Open Plots" },
  { href: "/farm-lands", label: "Farm Lands" },
];

const defaultSocialLinks = [
  { href: "#", label: "Facebook", icon: "/images/icons/facebook.png", key: "facebook" as const },
  { href: "#", label: "Twitter", icon: "/images/icons/x-twitter.png", key: "twitter" as const },
  { href: "#", label: "Instagram", icon: "/images/icons/instagram.png", key: "linkedin" as const },
  { href: "#", label: "YouTube", icon: "/images/icons/youtube.png", key: "youtube" as const },
];

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    async function fetchContact() {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    }
    fetchContact();
  }, []);

  const address = contactInfo?.address || "Realtor Office Building 5F\n123 Anywhere St., Any City, 12345 Any State";
  const phone = contactInfo?.phone || "123-456-7890";
  const email = contactInfo?.email || "support@urvi.com";
  const socialFacebook = contactInfo?.socialLinks?.facebook || "#";
  const socialTwitter = contactInfo?.socialLinks?.twitter || "#";
  const socialYoutube = contactInfo?.socialLinks?.youtube || "#";

  return (
    <footer>
      {/* Main Footer */}
      <div className="bg-[#F5F5F5] py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Logo & Contact */}
            <div>
              <Image
                src="/images/urvi-logo-footer.png"
                alt="Urvi Constructions"
                width={160}
                height={70}
                className="mb-8"
              />
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Image
                    src="/images/icons/location-footer.png"
                    alt="Location"
                    width={20}
                    height={20}
                    className="flex-shrink-0 mt-1"
                  />
                  <p className="text-sm text-[#1F2A54]">
                    {address.split("\n").map((line, i) => (
                      <span key={i}>{line}{i < address.split("\n").length - 1 && <br />}</span>
                    ))}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/icons/call-footer.png"
                    alt="Phone"
                    width={20}
                    height={20}
                    className="flex-shrink-0 icon-animate-bounce"
                  />
                  <a href={`tel:${phone}`} className="text-sm text-[#1F2A54] font-medium hover:text-[#DDA21A] transition-all duration-300 cursor-pointer">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/icons/mail-footer.png"
                    alt="Email"
                    width={20}
                    height={20}
                    className="flex-shrink-0 icon-animate-bounce"
                  />
                  <a href={`mailto:${email}`} className="text-sm text-[#1F2A54] font-medium hover:text-[#DDA21A] transition-all duration-300 cursor-pointer">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-[#1F2A54] text-lg mb-6 underline underline-offset-4">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#1F2A54] hover:text-[#DDA21A] transition-all duration-300 cursor-pointer hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Discover */}
            <div>
              <h4 className="font-semibold text-[#1F2A54] text-lg mb-6 underline underline-offset-4">Discover</h4>
              <ul className="space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-[#1F2A54] hover:text-[#DDA21A] transition-all duration-300 cursor-pointer hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Social */}
            <div>
              <h4 className="font-semibold text-[#1F2A54] text-lg mb-6 underline underline-offset-4">Get Social</h4>
              <div className="flex items-center gap-3">
                {defaultSocialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={(contactInfo?.socialLinks?.[social.key]) || social.href}
                    className="hover:opacity-70 transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <Image
                      src={social.icon || "/placeholder.svg"}
                      alt={social.label}
                      width={28}
                      height={28}
                      className="icon-animate-pulse"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#2D3748] py-4">
        <div className="max-w-[1200px] mx-auto px-4">
          <p className="text-center text-sm text-white">
            ©urvi - ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
