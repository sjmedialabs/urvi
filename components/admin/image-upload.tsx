"use client";

import React from "react"

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2, ImageIcon, Link2, AlertTriangle, Check, Info } from "lucide-react";

// Image validation rules configuration
export interface ImageValidationRules {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[]; // e.g., ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  aspectRatio?: { width: number; height: number; tolerance?: number }; // tolerance in percentage
  minDimensions?: { width: number; height: number };
  maxDimensions?: { width: number; height: number };
  recommendedDimensions?: { width: number; height: number };
}

// Preset validation rules for common use cases
export const IMAGE_PRESETS: Record<string, ImageValidationRules> = {
  heroBanner: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio: { width: 16, height: 9, tolerance: 5 },
    minDimensions: { width: 1920, height: 1080 },
    recommendedDimensions: { width: 1920, height: 1080 },
  },
  cardThumbnail: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio: { width: 1, height: 1, tolerance: 5 },
    minDimensions: { width: 400, height: 400 },
    recommendedDimensions: { width: 800, height: 800 },
  },
  blogFeatured: {
    maxFileSize: 3 * 1024 * 1024, // 3MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio: { width: 4, height: 3, tolerance: 5 },
    minDimensions: { width: 800, height: 600 },
    recommendedDimensions: { width: 1200, height: 900 },
  },
  projectImage: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio: { width: 3, height: 4, tolerance: 10 },
    minDimensions: { width: 600, height: 800 },
    recommendedDimensions: { width: 900, height: 1200 },
  },
  icon: {
    maxFileSize: 100 * 1024, // 100KB
    allowedTypes: ['image/svg+xml', 'image/png'],
    aspectRatio: { width: 1, height: 1, tolerance: 0 },
    maxDimensions: { width: 512, height: 512 },
  },
  gallery: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    minDimensions: { width: 800, height: 600 },
  },
  avatar: {
    maxFileSize: 1 * 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    aspectRatio: { width: 1, height: 1, tolerance: 0 },
    minDimensions: { width: 200, height: 200 },
    recommendedDimensions: { width: 400, height: 400 },
  },
  ogImage: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png'],
    aspectRatio: { width: 1200, height: 630, tolerance: 5 },
    minDimensions: { width: 1200, height: 630 },
    recommendedDimensions: { width: 1200, height: 630 },
  },
};

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Validate image against rules
async function validateImage(file: File, rules: ImageValidationRules): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file type
  if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
    const allowed = rules.allowedTypes.map(t => t.replace('image/', '')).join(', ');
    errors.push(`File type not allowed. Accepted: ${allowed}`);
  }

  // Check file size
  if (rules.maxFileSize && file.size > rules.maxFileSize) {
    const maxMB = (rules.maxFileSize / (1024 * 1024)).toFixed(1);
    const fileMB = (file.size / (1024 * 1024)).toFixed(1);
    errors.push(`File too large (${fileMB}MB). Maximum: ${maxMB}MB`);
  }

  // Check dimensions (requires loading the image)
  if (rules.aspectRatio || rules.minDimensions || rules.maxDimensions || rules.recommendedDimensions) {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions) {
      // Check aspect ratio
      if (rules.aspectRatio) {
        const targetRatio = rules.aspectRatio.width / rules.aspectRatio.height;
        const actualRatio = dimensions.width / dimensions.height;
        const tolerance = (rules.aspectRatio.tolerance || 0) / 100;
        
        if (Math.abs(actualRatio - targetRatio) > targetRatio * tolerance) {
          errors.push(`Aspect ratio should be ${rules.aspectRatio.width}:${rules.aspectRatio.height}`);
        }
      }

      // Check min dimensions
      if (rules.minDimensions) {
        if (dimensions.width < rules.minDimensions.width || dimensions.height < rules.minDimensions.height) {
          errors.push(`Minimum dimensions: ${rules.minDimensions.width}x${rules.minDimensions.height}px`);
        }
      }

      // Check max dimensions
      if (rules.maxDimensions) {
        if (dimensions.width > rules.maxDimensions.width || dimensions.height > rules.maxDimensions.height) {
          errors.push(`Maximum dimensions: ${rules.maxDimensions.width}x${rules.maxDimensions.height}px`);
        }
      }

      // Check recommended dimensions (warning, not error)
      if (rules.recommendedDimensions) {
        if (dimensions.width < rules.recommendedDimensions.width || dimensions.height < rules.recommendedDimensions.height) {
          warnings.push(`Recommended: ${rules.recommendedDimensions.width}x${rules.recommendedDimensions.height}px for best quality`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Get image dimensions from file
function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml') {
      // SVGs don't have fixed dimensions, skip check
      resolve(null);
      return;
    }

    const img = document.createElement('img');
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    
    img.src = url;
  });
}

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner" | "portrait";
  placeholder?: string;
  validationRules?: ImageValidationRules;
  preset?: keyof typeof IMAGE_PRESETS;
  showValidationInfo?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange, 
  folder = "uploads",
  className = "",
  aspectRatio = "video",
  placeholder = "Upload an image or enter URL",
  validationRules,
  preset,
  showValidationInfo = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get validation rules from preset or direct rules
  const rules = validationRules || (preset ? IMAGE_PRESETS[preset] : undefined);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
    portrait: "aspect-[3/4]",
  };

  // Get accepted file types for input
  const acceptedTypes = rules?.allowedTypes?.join(',') || 'image/*';

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setWarnings([]);
    setUploading(true);

    try {
      // Validate the file if rules exist
      if (rules) {
        const validation = await validateImage(file, rules);
        
        if (!validation.valid) {
          setError(validation.errors.join('. '));
          setUploading(false);
          return;
        }
        
        if (validation.warnings.length > 0) {
          setWarnings(validation.warnings);
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }, [folder, onChange, rules]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} rounded-lg overflow-hidden border bg-secondary/30`}>
          <Image 
            src={value || "/placeholder.svg"} 
            alt="Uploaded" 
            fill 
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={`relative ${aspectClasses[aspectRatio]} rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1F2A54] transition-colors bg-secondary/30 flex flex-col items-center justify-center cursor-pointer`}
          onClick={() => !showUrlInput && fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#1F2A54]" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : showUrlInput ? (
            <div className="p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                />
                <Button type="button" size="sm" onClick={handleUrlSubmit}>
                  Add
                </Button>
              </div>
              <button 
                type="button"
                className="text-xs text-muted-foreground mt-2 hover:text-[#1F2A54]"
                onClick={() => setShowUrlInput(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <ImageIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center px-4">{placeholder}</p>
              <div className="flex gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload size={14} className="mr-1" /> Upload
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(true);
                  }}
                >
                  <Link2 size={14} className="mr-1" /> URL
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      {/* Validation Info */}
      {showValidationInfo && rules && !value && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs">
          <div className="flex items-start gap-2 text-blue-700">
            <Info size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Image Requirements:</p>
              <ul className="space-y-0.5 text-blue-600">
                {rules.allowedTypes && (
                  <li>Format: {rules.allowedTypes.map(t => t.replace('image/', '').toUpperCase()).join(', ')}</li>
                )}
                {rules.maxFileSize && (
                  <li>Max size: {formatFileSize(rules.maxFileSize)}</li>
                )}
                {rules.aspectRatio && (
                  <li>Aspect ratio: {rules.aspectRatio.width}:{rules.aspectRatio.height}</li>
                )}
                {rules.minDimensions && (
                  <li>Min dimensions: {rules.minDimensions.width}x{rules.minDimensions.height}px</li>
                )}
                {rules.recommendedDimensions && (
                  <li>Recommended: {rules.recommendedDimensions.width}x{rules.recommendedDimensions.height}px</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2 text-red-700 text-sm">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2 text-yellow-700 text-sm">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <div>
              {warnings.map((warning, i) => (
                <p key={i}>{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success indicator when image is set */}
      {value && (
        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
          <Check size={14} />
          <span>Image uploaded successfully</span>
        </div>
      )}
    </div>
  );
}

// Multi-image upload component
interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  value = [],
  onChange,
  folder = "uploads",
  maxImages = 20,
  className = ""
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelect = async (files: FileList) => {
    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length && value.length + newUrls.length < maxImages; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          newUrls.push(data.url);
        }
      } catch {
        // Skip failed uploads
      }
    }

    onChange([...value, ...newUrls]);
    setUploading(false);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <Image src={url || "/placeholder.svg"} alt={`Image ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {value.length < maxImages && (
          <div
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#1F2A54] transition-colors flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#1F2A54]" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Images</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFilesSelect(e.target.files);
        }}
      />

      <p className="text-xs text-muted-foreground mt-2">
        {value.length} of {maxImages} images
      </p>
    </div>
  );
}
