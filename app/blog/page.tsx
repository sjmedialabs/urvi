"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getArticles, type Article } from "@/lib/firestore";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getArticles();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[280px] pt-20">
        <Image
          src="/images/blog-banner.png"
          alt="Blog Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="inner-hero-title font-serif text-white text-center tracking-wider">
            PROJECT GALOUR LATEST
            <br />
            PROJECTSLARY
          </h1>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Decorative U Pattern Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-50 pointer-events-none">
          <Image
            src="/images/u-pattern.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-sans font-bold text-2xl md:text-3xl text-[#1F2A54] mb-2">
              LATEST
            </h2>
            <p className="text-[#DDA21A] text-lg tracking-wider">
              NEWS INSIGHTS
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#DDA21A]" />
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No blog posts available yet.</p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post, index) => (
                <article key={`${post.id}-${index}`} className="group card-hover-lift">
                  {/* Clickable Image */}
                  <Link href={`/blog/${post.id}`}>
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 cursor-pointer">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Content */}
                  <div>
                    <h3 className="text-[#1F2A54] font-semibold text-base mb-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#DDA21A] text-xs mb-2">{post.date}</p>
                    <p className="text-[#666666] text-sm mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center gap-2 text-[#1F2A54] font-medium text-sm hover:text-[#DDA21A] transition-colors"
                    >
                      Read More
                      <Image
                        src="/images/arrow-right.png"
                        alt=""
                        width={20}
                        height={10}
                        className="w-5 h-auto"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
