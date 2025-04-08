"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { IconArrowLeft, IconUpload } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Portfolio {
  id: string;
  email: string;
  x_url: string;
  github_url: string;
  linkedin_url: string;
  facebook_url: string;
  name: string;
  about: string;
  bio: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioResponse {
  statusCode: number;
  data: Portfolio[];
  message: string;
  success: boolean;
}

export default function EditPortfolioPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    about: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    x_url: "",
    facebook_url: "",
    image_url: "",
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get<PortfolioResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/portfolio`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const portfolioData = response.data.data[0];
        setPortfolio(portfolioData);
        setFormData({
          name: portfolioData.name,
          bio: portfolioData.bio,
          about: portfolioData.about,
          email: portfolioData.email,
          github_url: portfolioData.github_url,
          linkedin_url: portfolioData.linkedin_url,
          x_url: portfolioData.x_url,
          facebook_url: portfolioData.facebook_url,
          image_url: portfolioData.image_url,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch portfolio");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!portfolio) return;

    setIsSubmitting(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/portfolio`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Portfolio updated successfully");
        router.push("/portfolio");
      } else {
        throw new Error(response.data.message || "Failed to update portfolio");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update portfolio"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid gap-6">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader label="Edit Portfolio" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/portfolio")}
                  >
                    <IconArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to Portfolio</span>
                  </Button>
                  <h1 className="text-2xl font-bold">Edit Portfolio</h1>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image">Profile Image</Label>
                        <div className="flex flex-col items-start gap-4">
                          <div className="relative h-48 w-48 rounded-full overflow-hidden">
                            {formData.image_url ? (
                              <Image
                                src={formData.image_url}
                                alt="Profile"
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center">
                                <IconUpload className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <CldUploadWidget
                            uploadPreset="images_preset"
                            onSuccess={(result: any) => {
                              if (result.info && result.info.secure_url) {
                                setFormData((prev) => ({
                                  ...prev,
                                  image_url: result.info.secure_url,
                                }));
                                setImageError("");
                                toast.success("Image uploaded successfully");
                              }
                            }}
                            onError={(error: any) => {
                              console.error("Upload error:", error);
                              setImageError(
                                "Failed to upload image. Please try again."
                              );
                              toast.error("Failed to upload image");
                            }}
                          >
                            {({ open }) => (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => open()}
                              >
                                {formData.image_url
                                  ? "Change Image"
                                  : "Upload Image"}
                              </Button>
                            )}
                          </CldUploadWidget>
                          {imageError && (
                            <p className="text-sm text-red-500">{imageError}</p>
                          )}
                          {formData.image_url && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  image_url: "",
                                }))
                              }
                            >
                              Remove Image
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about">About</Label>
                        <Input
                          id="about"
                          name="about"
                          value={formData.about}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          name="github_url"
                          value={formData.github_url}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                        <Input
                          id="linkedin_url"
                          name="linkedin_url"
                          value={formData.linkedin_url}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="x_url">X (Twitter) URL</Label>
                        <Input
                          id="x_url"
                          name="x_url"
                          value={formData.x_url}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facebook_url">Facebook URL</Label>
                        <Input
                          id="facebook_url"
                          name="facebook_url"
                          value={formData.facebook_url}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/portfolio")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
