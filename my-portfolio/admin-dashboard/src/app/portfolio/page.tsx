"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconPencil,
} from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
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

export default function PortfolioPage() {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setPortfolio(response.data.data[0]);
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

  const handleEditClick = () => {
    router.push("/portfolio/edit");
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-48 w-48 rounded-full" />
        <div className="space-y-4 flex-1">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-4 mt-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
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
        <SiteHeader label="Portfolio" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">Portfolio Information</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleEditClick}
                  >
                    <IconPencil className="h-4 w-4" />
                    <span className="sr-only">Edit Portfolio</span>
                  </Button>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : portfolio ? (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="relative h-48 w-48 rounded-full overflow-hidden">
                        <Image
                          src={portfolio.image_url}
                          alt={portfolio.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-4 flex-1">
                        <h2 className="text-2xl font-bold">{portfolio.name}</h2>
                        <p className="text-muted-foreground">
                          {portfolio.about}
                        </p>
                        <div className="flex gap-4 mt-4">
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="Email"
                          >
                            <a
                              href={`mailto:${portfolio.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconMail className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="X (Twitter)"
                          >
                            <a
                              href={portfolio.x_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconBrandX className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="GitHub"
                          >
                            <a
                              href={portfolio.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconBrandGithub className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="LinkedIn"
                          >
                            <a
                              href={portfolio.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconBrandLinkedin className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            title="Facebook"
                          >
                            <a
                              href={portfolio.facebook_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconBrandFacebook className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{portfolio.about}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Bio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{portfolio.bio}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p>
                            <strong>Email:</strong> {portfolio.email}
                          </p>
                          <p>
                            <strong>X (Twitter):</strong>{" "}
                            <a
                              href={portfolio.x_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {portfolio.x_url}
                            </a>
                          </p>
                          <p>
                            <strong>GitHub:</strong>{" "}
                            <a
                              href={portfolio.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {portfolio.github_url}
                            </a>
                          </p>
                          <p>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                              href={portfolio.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {portfolio.linkedin_url}
                            </a>
                          </p>
                          <p>
                            <strong>Facebook:</strong>{" "}
                            <a
                              href={portfolio.facebook_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {portfolio.facebook_url}
                            </a>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    No portfolio information found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
