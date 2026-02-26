"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  getProjectById,
  getPropertyAmenities,
  addPropertyAmenity,
  updatePropertyAmenity,
  deletePropertyAmenity,
  getPropertyDetails,
  updatePropertyDetails,
  type Project,
  type PropertyAmenity,
  type PropertyDetails,
} from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  ImageIcon,
  Save,
} from "lucide-react";
import { ImageUpload, MultiImageUpload } from "@/components/admin/image-upload";

export default function ProjectDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [amenities, setAmenities] = useState<PropertyAmenity[]>([]);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Amenity Dialog
  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<PropertyAmenity | null>(null);
  const [amenityForm, setAmenityForm] = useState({
    name: "",
    image: "",
    galleryImages: ["", "", ""],
  });

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAmenity, setDeletingAmenity] = useState<PropertyAmenity | null>(null);

  // Property Details Form
  const [detailsForm, setDetailsForm] = useState({
    tagline: "",
    price: "",
    priceLabel: "Price:",
    heroImage: "",
    about: "",
    reraNumber: "",
    videoUrl: "",
    brochureUrl: "",
    totalLandArea: "",
    noOfBlocks: "",
    totalUnits: "",
    configuration: "",
    floors: "",
    possessionStarts: "",
    locationAddress: "",
    mapUrl: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && projectId) {
      loadData();
    }
  }, [user, projectId]);

  const loadData = async () => {
    try {
      const [projectData, amenitiesData, detailsData] = await Promise.all([
        getProjectById(projectId),
        getPropertyAmenities(projectId),
        getPropertyDetails(projectId),
      ]);
      
      setProject(projectData);
      setAmenities(amenitiesData);
      setPropertyDetails(detailsData);

      if (detailsData) {
        setDetailsForm({
          tagline: detailsData.tagline || "",
          price: detailsData.price || "",
          priceLabel: detailsData.priceLabel || "Price:",
          heroImage: detailsData.heroImage || "",
          about: detailsData.about || "",
          reraNumber: detailsData.reraNumber || "",
          videoUrl: detailsData.videoUrl || "",
          brochureUrl: detailsData.brochureUrl || "",
          totalLandArea: detailsData.stats?.totalLandArea || "",
          noOfBlocks: detailsData.stats?.noOfBlocks || "",
          totalUnits: detailsData.stats?.totalUnits || "",
          configuration: detailsData.stats?.configuration || "",
          floors: detailsData.stats?.floors || "",
          possessionStarts: detailsData.stats?.possessionStarts || "",
          locationAddress: detailsData.location?.address || "",
          mapUrl: detailsData.location?.mapUrl || "",
        });
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAmenityDialog = (amenity?: PropertyAmenity) => {
    if (amenity) {
      setEditingAmenity(amenity);
      setAmenityForm({
        name: amenity.name,
        image: amenity.image,
        galleryImages: amenity.galleryImages.length >= 3 
          ? amenity.galleryImages.slice(0, 3)
          : [...amenity.galleryImages, ...Array(3 - amenity.galleryImages.length).fill("")],
      });
    } else {
      setEditingAmenity(null);
      setAmenityForm({
        name: "",
        image: "",
        galleryImages: ["", "", ""],
      });
    }
    setAmenityDialogOpen(true);
  };

  const handleSaveAmenity = async () => {
    setSaving(true);
    try {
      const amenityData = {
        propertyId: projectId,
        name: amenityForm.name,
        image: amenityForm.image,
        galleryImages: amenityForm.galleryImages.filter(img => img.trim() !== ""),
        order: editingAmenity?.order ?? amenities.length,
      };

      if (editingAmenity?.id) {
        await updatePropertyAmenity(editingAmenity.id, amenityData);
      } else {
        await addPropertyAmenity(amenityData);
      }
      await loadData();
      setAmenityDialogOpen(false);
    } catch (error) {
      console.error("Error saving amenity:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAmenity = async () => {
    if (!deletingAmenity?.id) return;
    setSaving(true);
    try {
      await deletePropertyAmenity(deletingAmenity.id);
      await loadData();
      setDeleteDialogOpen(false);
      setDeletingAmenity(null);
    } catch (error) {
      console.error("Error deleting amenity:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await updatePropertyDetails(projectId, {
        projectId,
        tagline: detailsForm.tagline,
        price: detailsForm.price,
        priceLabel: detailsForm.priceLabel,
        heroImage: detailsForm.heroImage,
        about: detailsForm.about,
        reraNumber: detailsForm.reraNumber,
        videoUrl: detailsForm.videoUrl,
        brochureUrl: detailsForm.brochureUrl,
        stats: {
          totalLandArea: detailsForm.totalLandArea,
          noOfBlocks: detailsForm.noOfBlocks,
          totalUnits: detailsForm.totalUnits,
          configuration: detailsForm.configuration,
          floors: detailsForm.floors,
          possessionStarts: detailsForm.possessionStarts,
        },
        location: {
          address: detailsForm.locationAddress,
          mapUrl: detailsForm.mapUrl,
          nearbyPlaces: [],
        },
      });
      await loadData();
    } catch (error) {
      console.error("Error saving details:", error);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <Loader2 className="h-8 w-8 animate-spin text-[#1F2A54]" />
      </div>
    );
  }

  if (!user || !project) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 bg-white border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard/projects"
              className="p-2 hover:bg-secondary rounded-lg"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-[#1F2A54]">{project.title}</h1>
              <p className="text-sm text-muted-foreground">{project.location}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="details">Property Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="stats">Stats Bar</TabsTrigger>
          </TabsList>

          {/* Property Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input
                      value={detailsForm.tagline}
                      onChange={(e) => setDetailsForm({ ...detailsForm, tagline: e.target.value })}
                      placeholder="YOUR HOME TO LIVE YOUR LIFE AT ITS BEST"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      value={detailsForm.price}
                      onChange={(e) => setDetailsForm({ ...detailsForm, price: e.target.value })}
                      placeholder="7.45 CR"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hero Image</Label>
                    <ImageUpload
                      value={detailsForm.heroImage}
                      onChange={(url) => setDetailsForm({ ...detailsForm, heroImage: url })}
                      folder="projects/hero"
                      aspectRatio="banner"
                      preset="heroBanner"
                      placeholder="Upload project hero image"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RERA Number</Label>
                    <Input
                      value={detailsForm.reraNumber}
                      onChange={(e) => setDetailsForm({ ...detailsForm, reraNumber: e.target.value })}
                      placeholder="P02400001822"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>About Project</Label>
                  <Textarea
                    value={detailsForm.about}
                    onChange={(e) => setDetailsForm({ ...detailsForm, about: e.target.value })}
                    placeholder="Detailed description of the project..."
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={detailsForm.videoUrl}
                      onChange={(e) => setDetailsForm({ ...detailsForm, videoUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Brochure URL</Label>
                    <Input
                      value={detailsForm.brochureUrl}
                      onChange={(e) => setDetailsForm({ ...detailsForm, brochureUrl: e.target.value })}
                      placeholder="https://example.com/brochure.pdf"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location Address</Label>
                  <Input
                    value={detailsForm.locationAddress}
                    onChange={(e) => setDetailsForm({ ...detailsForm, locationAddress: e.target.value })}
                    placeholder="TukkuGuda, Hyderabad"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Embed URL</Label>
                  <Input
                    value={detailsForm.mapUrl}
                    onChange={(e) => setDetailsForm({ ...detailsForm, mapUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                  />
                </div>
                <Button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="bg-[#1F2A54] hover:bg-[#1F2A54]/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Details
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1F2A54]">Project Amenities</h2>
              <Button
                onClick={() => handleOpenAmenityDialog()}
                className="bg-[#1F2A54] hover:bg-[#1F2A54]/90"
              >
                <Plus size={18} className="mr-2" />
                Add Amenity
              </Button>
            </div>

            {amenities.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No amenities yet. Add your first amenity!</p>
                  <Button
                    onClick={() => handleOpenAmenityDialog()}
                    className="bg-[#1F2A54] hover:bg-[#1F2A54]/90"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Amenity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {amenities.map((amenity) => (
                  <Card key={amenity.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <Image
                        src={amenity.image || "/placeholder.svg"}
                        alt={amenity.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <GripVertical className="text-white/70" size={20} />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => handleOpenAmenityDialog(amenity)}
                          className="p-2 bg-white rounded-full shadow hover:bg-secondary"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingAmenity(amenity);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-2 bg-white rounded-full shadow hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white font-semibold text-sm">{amenity.name}</p>
                        <p className="text-white/70 text-xs">{amenity.galleryImages.length} gallery images</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stats Bar Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Total Land Area</Label>
                    <Input
                      value={detailsForm.totalLandArea}
                      onChange={(e) => setDetailsForm({ ...detailsForm, totalLandArea: e.target.value })}
                      placeholder="2.9 Acres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>No. of Blocks</Label>
                    <Input
                      value={detailsForm.noOfBlocks}
                      onChange={(e) => setDetailsForm({ ...detailsForm, noOfBlocks: e.target.value })}
                      placeholder="4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Units</Label>
                    <Input
                      value={detailsForm.totalUnits}
                      onChange={(e) => setDetailsForm({ ...detailsForm, totalUnits: e.target.value })}
                      placeholder="110"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Configuration</Label>
                    <Input
                      value={detailsForm.configuration}
                      onChange={(e) => setDetailsForm({ ...detailsForm, configuration: e.target.value })}
                      placeholder="2&3 BHK Apts"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Floors</Label>
                    <Input
                      value={detailsForm.floors}
                      onChange={(e) => setDetailsForm({ ...detailsForm, floors: e.target.value })}
                      placeholder="3B+G+15 Floors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Possession Starts</Label>
                    <Input
                      value={detailsForm.possessionStarts}
                      onChange={(e) => setDetailsForm({ ...detailsForm, possessionStarts: e.target.value })}
                      placeholder="Dec,2026"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSaveDetails}
                  disabled={saving}
                  className="bg-[#1F2A54] hover:bg-[#1F2A54]/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Stats
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add/Edit Amenity Dialog */}
      <Dialog open={amenityDialogOpen} onOpenChange={setAmenityDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAmenity ? "Edit Amenity" : "Add New Amenity"}</DialogTitle>
            <DialogDescription>
              {editingAmenity ? "Update amenity details" : "Add a new amenity to this property"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amenity Name</Label>
              <Input
                value={amenityForm.name}
                onChange={(e) => setAmenityForm({ ...amenityForm, name: e.target.value })}
                placeholder="e.g., TRANQUIL AMENITIES"
              />
            </div>
            <div className="space-y-2">
              <Label>Main Image</Label>
              <ImageUpload
                value={amenityForm.image}
                onChange={(url) => setAmenityForm({ ...amenityForm, image: url })}
                folder="projects/amenities"
                aspectRatio="video"
                preset="projectImage"
                placeholder="Upload amenity image"
              />
            </div>
            <div className="space-y-2">
              <Label>Gallery Images (for popup)</Label>
              <MultiImageUpload
                value={amenityForm.galleryImages}
                onChange={(urls) => setAmenityForm({ ...amenityForm, galleryImages: urls })}
                folder="projects/amenities/gallery"
                maxImages={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAmenityDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAmenity}
              disabled={saving || !amenityForm.name || !amenityForm.image}
              className="bg-[#1F2A54] hover:bg-[#1F2A54]/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Amenity"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Amenity</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingAmenity?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAmenity}
              disabled={saving}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
