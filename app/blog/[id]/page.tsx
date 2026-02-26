"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getArticles, type Article } from "@/lib/firestore";
import { Footer } from "@/components/footer";
import { Loader2, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";


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

// Default blog posts (fallback if no data from admin)
const defaultPosts: Article[] = [
  {
    id: "1",
    title: "How to Get Started in Buying Your First Home",
    category: "Real Estate",
    date: "March 18, 2025",
    image: "/images/blog/blog-1.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Buying your first home is one of the most significant milestones in life. It's a journey that combines excitement with careful planning and informed decision-making.

**Understanding Your Budget**

Before you start browsing listings, it's crucial to understand what you can afford. Consider not just the purchase price, but also closing costs, property taxes, insurance, and maintenance expenses.

**Getting Pre-Approved**

A mortgage pre-approval gives you a clear picture of how much you can borrow and shows sellers you're a serious buyer. This step involves submitting financial documents and having your credit checked.

**Finding the Right Location**

Location matters more than the house itself in many ways. Consider proximity to work, schools, amenities, and the neighborhood's growth potential.

**Working with Professionals**

A good real estate agent and mortgage broker can guide you through the process, helping you avoid common pitfalls and negotiate the best deal.

**The Inspection Process**

Never skip the home inspection. It can reveal hidden issues that could cost thousands to repair later. Use the inspection report to negotiate repairs or a lower price.

**Closing the Deal**

The final step involves signing numerous documents and transferring funds. Make sure you understand everything you're signing and don't hesitate to ask questions.`,
  },
  {
    id: "2",
    title: "Exploring Minimalism with a Touch of Luxury",
    category: "Architecture",
    date: "March 18, 2025",
    image: "/images/blog/blog-2.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Minimalist architecture doesn't mean sacrificing comfort or elegance. Instead, it's about finding beauty in simplicity while incorporating luxurious elements that enhance daily living.

**The Philosophy of Less**

Minimalism is rooted in the idea that less is more. By reducing visual clutter and unnecessary elements, spaces become more peaceful and functional.

**Quality Over Quantity**

In minimalist luxury design, every piece matters. Choose fewer items, but ensure each one is of exceptional quality and craftsmanship.

**Natural Materials**

Incorporate natural materials like marble, wood, and stone to add warmth and texture without compromising the clean aesthetic.

**Strategic Lighting**

Lighting plays a crucial role in minimalist spaces. Natural light should be maximized, while artificial lighting should be subtle yet effective.

**Curated Art and Accessories**

Select a few meaningful pieces of art or accessories that complement the space without overwhelming it.`,
  },
  {
    id: "3",
    title: "Sustainable Cities: A Greener Future",
    category: "Sustainability",
    date: "March 18, 2025",
    image: "/images/blog/blog-3.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `As urban populations continue to grow, the need for sustainable city planning has never been more critical. Cities around the world are reimagining how we live, work, and interact with our environment.

**Green Infrastructure**

Modern cities are incorporating green roofs, urban forests, and vertical gardens to improve air quality, reduce heat islands, and provide habitats for wildlife.

**Sustainable Transportation**

From electric buses to extensive cycling networks, sustainable cities prioritize clean transportation options that reduce emissions and improve public health.

**Energy Efficiency**

Smart grids, renewable energy sources, and energy-efficient buildings are becoming standard features in forward-thinking urban developments.

**Water Management**

Innovative water recycling systems, rainwater harvesting, and permeable pavements help cities manage water resources more effectively.

**Community Engagement**

Sustainable cities involve residents in planning decisions, creating spaces that meet the needs of diverse communities while fostering environmental stewardship.`,
  },
  {
    id: "4",
    title: "Are Sustainable Materials the Future of Homes?",
    category: "Materials",
    date: "March 18, 2025",
    image: "/images/blog/blog-4.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `The construction industry is undergoing a transformation as sustainable materials become more accessible and cost-effective. These innovations are changing how we build and maintain our homes.

**Bamboo: The Versatile Wonder**

Bamboo grows rapidly and has impressive strength-to-weight ratio, making it an excellent alternative to traditional hardwoods.

**Recycled Steel**

Steel can be recycled indefinitely without losing quality, making it one of the most sustainable structural materials available.

**Hempcrete**

Made from hemp fibers and lime, hempcrete is carbon-negative, naturally insulating, and resistant to mold and pests.

**Reclaimed Wood**

Using reclaimed wood reduces demand for new timber while adding character and history to new constructions.

**Living Building Materials**

Researchers are developing materials that can heal themselves, purify air, and even generate energy, pointing to an exciting future for sustainable construction.`,
  },
  {
    id: "5",
    title: "Smart Homes: The Future of Living",
    category: "Technology",
    date: "March 18, 2025",
    image: "/images/blog/blog-1.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Smart home technology has evolved from a luxury novelty to an integral part of modern living. Today's smart homes offer unprecedented convenience, security, and energy efficiency.

**Voice Control**

Voice assistants have become the central hub for many smart homes, allowing residents to control everything from lights to temperature with simple commands.

**Energy Management**

Smart thermostats, automated blinds, and intelligent lighting systems work together to optimize energy usage and reduce utility bills.

**Security Systems**

Modern smart security includes facial recognition, motion sensors, and real-time alerts that keep homes safer than ever before.

**Health and Wellness**

From air quality monitors to circadian lighting, smart homes are increasingly focused on supporting residents' health and well-being.`,
  },
  {
    id: "6",
    title: "Biophilic Architecture: Nature in Design",
    category: "Architecture",
    date: "March 18, 2025",
    image: "/images/blog/blog-2.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Biophilic design acknowledges our innate connection to nature and incorporates natural elements into built environments. This approach has been shown to improve well-being, productivity, and creativity.

**Natural Light**

Maximizing natural light through strategic window placement, skylights, and light wells creates healthier and more pleasant spaces.

**Living Walls**

Vertical gardens not only beautify spaces but also improve air quality and provide a direct connection to nature.

**Natural Materials**

Wood, stone, and other natural materials create sensory connections to the outdoors while adding warmth to interiors.

**Water Features**

The sight and sound of water has a calming effect, making fountains and water features popular biophilic elements.

**Views of Nature**

Even in urban environments, views of trees, gardens, or the sky can significantly impact occupants' well-being.`,
  },
  {
    id: "7",
    title: "Infusing new energy while preserving the soul of structure.",
    category: "Design",
    date: "March 18, 2025",
    image: "/images/blog/blog-3.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Renovating historic buildings presents unique challenges and opportunities. The goal is to modernize functionality while respecting and preserving the original character.

**Understanding History**

Before any renovation begins, thorough research into the building's history and original design intent is essential.

**Sensitive Additions**

New elements should complement rather than compete with original features, using contemporary design language that acknowledges the past.

**Modern Systems**

Integrating modern mechanical, electrical, and plumbing systems requires careful planning to minimize impact on historic fabric.

**Material Matching**

When repairs are needed, sourcing or creating materials that match original specifications ensures visual and structural consistency.

**Documentation**

Preserving records of both the original building and renovation work ensures future generations can continue the stewardship.`,
  },
  {
    id: "8",
    title: "Biophilic Design Bringing Nature Indoors",
    category: "Interior",
    date: "March 18, 2025",
    image: "/images/blog/blog-4.png",
    excerpt: "It's no secret that access to quality education is unevenly distributed. Many children in underserved communities",
    content: `Bringing nature indoors through biophilic design creates spaces that nurture both body and mind. This approach goes beyond simply adding plants to thoughtfully integrating natural elements throughout interiors.

**Indoor Gardens**

From simple herb gardens to elaborate indoor landscapes, growing plants indoors connects us to natural cycles and provides fresh air.

**Natural Color Palettes**

Earth tones, sky blues, and leafy greens create calming environments that echo outdoor settings.

**Organic Forms**

Furniture and architectural elements inspired by natural forms create visual interest while fostering connection to nature.

**Natural Textures**

Incorporating wood grain, stone texture, and woven materials adds sensory richness to interiors.

**Seasonal Adaptation**

Changing decor and plant selections with the seasons helps maintain connection to natural rhythms throughout the year.`,
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const data = await getArticles();
        const foundPost = data.find((p) => p.id === params.id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          // Check default posts
          const defaultPost = defaultPosts.find((p) => p.id === params.id);
          if (defaultPost) {
            setPost(defaultPost);
          }
        }
      } catch {
        // Check default posts on error
        const defaultPost = defaultPosts.find((p) => p.id === params.id);
        if (defaultPost) {
          setPost(defaultPost);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#DDA21A]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white font-sans">
        {/* White Navbar */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center py-4">
              <Link href="/">
                <Image
                  src="/images/urvi-logo.png"
                  alt="Urvi Constructions"
                  width={120}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>
        </header>
        <div className="py-32 text-center">
          <h1 className="text-2xl font-bold text-[#1F2A54] mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="text-[#DDA21A] hover:underline">
            Return to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* White Navbar - Matching Home Page */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-col items-center">
            {/* Logo - Centered */}
            <div className="pt-4 pb-2">
              <Link href="/">
                <Image
                  src="/images/urvi-logo.png"
                  alt="Urvi Constructions"
                  width={120}
                  height={50}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Row */}
            <div className="w-full flex items-center justify-center pb-4">
              <nav className="flex items-center justify-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      link.href === "/blog"
                        ? "text-[#DDA21A]"
                        : "text-[#1F2A54] hover:text-[#DDA21A]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button className="font-medium px-6 py-2 rounded-md bg-[#1F2A54] hover:bg-[#1F2A54]/90 text-white ml-4">
                  Enquiry Now
                </Button>
              </nav>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            <div className="flex items-center justify-center py-4 relative">
              <Link href="/">
                <Image
                  src="/images/urvi-logo.png"
                  alt="Urvi Constructions"
                  width={100}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>

              <button
                type="button"
                className="absolute right-0 p-2 text-[#1F2A54]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="pb-4 bg-white">
                <nav className="flex flex-col items-center gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 text-sm transition-colors text-center ${
                        link.href === "/blog"
                          ? "text-[#DDA21A]"
                          : "text-[#1F2A54] hover:text-[#DDA21A]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button className="font-medium mt-2 bg-[#1F2A54] hover:bg-[#1F2A54]/90 text-white">
                    Enquiry Now
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Banner Image - Full Width */}
      <section className="relative w-full">
        <div className="max-w-[900px] mx-auto px-4 pt-8">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src={post.image || "/images/blog-details-banner.png"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12">
        <div className="max-w-[750px] mx-auto px-4">
          {/* Title - Gold color as per reference */}
          <h1 className="text-[#DDA21A] text-xl md:text-2xl lg:text-[28px] font-bold mb-2 leading-tight">
            {post.title}
          </h1>

          {/* Date - Bold black as per reference */}
          <p className="text-[#1F2A54] text-sm font-bold mb-8">
            {post.date}
          </p>

          {/* Content - Justified text with proper spacing */}
          <article className="max-w-none">
            {post.content ? (
              <div className="space-y-5">
                {post.content.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h3 key={idx} className="text-[#1F2A54] font-bold text-base mt-6 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  return (
                    <p key={idx} className="text-[#666666] text-sm leading-[1.8] text-justify">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#666666] text-sm leading-[1.8] text-justify">{post.excerpt}</p>
            )}
          </article>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
