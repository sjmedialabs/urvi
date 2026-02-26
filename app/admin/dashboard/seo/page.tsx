"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getCMSPages, type CMSPage } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Search,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  ExternalLink,
  Settings,
} from "lucide-react";

export default function GlobalSEOPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const pagesData = await getCMSPages();
        setPages(pagesData);
      } catch (error) {
        console.error("Error fetching pages:", error);
      } finally {
        setLoadingData(false);
      }
    }
    if (user) {
      fetchData();
    }
  }, [user]);

  // Calculate SEO score for a page
  const getPageSEOScore = (page: CMSPage) => {
    let score = 0;
    const issues: string[] = [];

    // Meta title
    if (page.metaTitle) {
      if (page.metaTitle.length >= 30 && page.metaTitle.length <= 60) {
        score += 25;
      } else {
        score += 10;
        issues.push("Meta title length");
      }
    } else {
      issues.push("Missing meta title");
    }

    // Meta description
    if (page.metaDescription) {
      if (page.metaDescription.length >= 120 && page.metaDescription.length <= 160) {
        score += 25;
      } else {
        score += 10;
        issues.push("Meta description length");
      }
    } else {
      issues.push("Missing meta description");
    }

    // Keywords
    if (page.metaKeywords && page.metaKeywords.length >= 3) {
      score += 20;
    } else if (page.metaKeywords && page.metaKeywords.length > 0) {
      score += 10;
      issues.push("Add more keywords");
    } else {
      issues.push("No keywords");
    }

    // OG Image
    if (page.ogImage) {
      score += 20;
    } else {
      issues.push("Missing OG image");
    }

    // Indexing
    if (page.isIndexed) {
      score += 10;
    }

    return { score, issues };
  };

  // Calculate overall score
  const getOverallScore = () => {
    if (pages.length === 0) return 0;
    const totalScore = pages.reduce((sum, page) => sum + getPageSEOScore(page).score, 0);
    return Math.round(totalScore / pages.length);
  };

  const overallScore = getOverallScore();

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F2A54]" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2A54]">SEO Manager</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of all page SEO settings and optimization
          </p>
        </div>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#1F2A54]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Overall Score Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Search size={18} /> Overall Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-28 h-28 rounded-full text-4xl font-bold ${
                    overallScore >= 80
                      ? "bg-green-100 text-green-600"
                      : overallScore >= 50
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {overallScore}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {overallScore >= 80
                    ? "Excellent SEO"
                    : overallScore >= 50
                    ? "Good SEO"
                    : "Needs Work"}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Indexed Pages</span>
                  <span className="font-medium">
                    {pages.filter((p) => p.isIndexed).length}/{pages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active Pages</span>
                  <span className="font-medium">
                    {pages.filter((p) => p.isActive).length}/{pages.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">With OG Images</span>
                  <span className="font-medium">
                    {pages.filter((p) => p.ogImage).length}/{pages.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pages List */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Pages</CardTitle>
                <CardDescription>Click on a page to edit its SEO settings</CardDescription>
              </CardHeader>
              <CardContent>
                {pages.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No pages created yet</p>
                    <Link href="/admin/dashboard/pages">
                      <Button className="bg-[#1F2A54]">Create Pages</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pages.map((page) => {
                      const { score, issues } = getPageSEOScore(page);
                      return (
                        <div
                          key={page.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-secondary/30 transition-colors"
                        >
                          {/* Status Indicators */}
                          <div className="flex items-center gap-2">
                            {page.isActive ? (
                              <Eye size={16} className="text-green-500" />
                            ) : (
                              <EyeOff size={16} className="text-gray-400" />
                            )}
                            {page.isIndexed ? (
                              <Globe size={16} className="text-blue-500" />
                            ) : (
                              <Globe size={16} className="text-gray-400" />
                            )}
                          </div>

                          {/* Page Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-[#1F2A54] truncate">{page.title}</h3>
                            <p className="text-sm text-muted-foreground">/{page.slug}</p>
                          </div>

                          {/* Score */}
                          <div className="flex items-center gap-3 w-48">
                            <Progress
                              value={score}
                              className={`h-2 ${
                                score >= 80
                                  ? "[&>div]:bg-green-500"
                                  : score >= 50
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-red-500"
                              }`}
                            />
                            <span
                              className={`text-sm font-medium w-8 ${
                                score >= 80
                                  ? "text-green-600"
                                  : score >= 50
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {score}
                            </span>
                          </div>

                          {/* Issues Badge */}
                          {issues.length > 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              <AlertTriangle size={12} className="mr-1" />
                              {issues.length} issue{issues.length > 1 ? "s" : ""}
                            </Badge>
                          )}
                          {issues.length === 0 && (
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              <Check size={12} className="mr-1" />
                              Good
                            </Badge>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Link href={`/admin/dashboard/pages/${page.id}/seo`}>
                              <Button variant="outline" size="sm">
                                <Settings size={14} className="mr-1" /> Edit SEO
                              </Button>
                            </Link>
                            <Link href={`/${page.slug}`} target="_blank">
                              <Button variant="ghost" size="icon">
                                <ExternalLink size={14} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SEO Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="font-medium">Meta Title</p>
                      <p className="text-muted-foreground">
                        Keep between 30-60 characters for optimal display
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="font-medium">Meta Description</p>
                      <p className="text-muted-foreground">
                        Write 120-160 characters to avoid truncation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="font-medium">Keywords</p>
                      <p className="text-muted-foreground">Add 3-10 relevant keywords per page</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <p className="font-medium">Open Graph Image</p>
                      <p className="text-muted-foreground">
                        Use 1200x630px for social media sharing
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
