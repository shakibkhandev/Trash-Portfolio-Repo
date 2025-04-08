"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconEye,
  IconEyeOff,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  createdAt: string;
  readingTime: string;
  isHidden: boolean;
  tags: Array<{ id: string; label: string }>;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  links: {
    self: string;
    prev: string | null;
    next: string | null;
  };
}

interface BlogsResponse {
  data: Blog[];
  pagination: PaginationData;
}

export default function BlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog?limit=10&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized access
            Cookies.remove("access_token");
            router.push("/login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error("Failed to fetch blogs");
        }

        const data: BlogsResponse = await response.json();
        setBlogs(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching blogs"
        );
        toast.error("Failed to fetch blogs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [router]);

  if (isLoading) {
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
          <SiteHeader label="Blogs" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Blogs</h1>
                    <Button variant="outline" size="icon" disabled>
                      <IconPlus className="h-4 w-4" />
                      <span className="sr-only">Add Blog</span>
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Card key={index} className="flex flex-col">
                        <CardHeader className="flex-1 p-4">
                          <div className="flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                          <Skeleton className="aspect-video w-full rounded-lg mb-3" />
                          <div className="flex gap-1.5">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-1.5">
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                            <Skeleton className="h-7 w-7 rounded-md" />
                          </div>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
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
          <SiteHeader label="Blogs" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="p-6">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-destructive">{error}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

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
        <SiteHeader label="Blogs" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Blogs</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      router.push("/blogs/create");
                    }}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Blog</span>
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {blogs.map((blog) => (
                    <Card key={blog.id} className="flex flex-col">
                      <CardHeader className="flex-1 p-4">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 text-base">
                            {blog.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 text-sm">
                            {blog.description}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 p-4">
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                          <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="h-full w-full object-cover"
                          />
                          <Badge
                            variant="outline"
                            className="absolute right-2 top-2 text-xs"
                          >
                            {blog.isHidden ? "Hidden" : "Published"}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {blog.tags.map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={async () => {
                              try {
                                const accessToken = Cookies.get("access_token");
                                if (!accessToken) {
                                  throw new Error("No access token found");
                                }

                                const endpoint = blog.isHidden
                                  ? "unhide"
                                  : "hide";
                                const response = await fetch(
                                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog/${blog.id}/${endpoint}`,
                                  {
                                    method: "PUT",
                                    headers: {
                                      Authorization: `Bearer ${accessToken}`,
                                      "Content-Type": "application/json",
                                    },
                                  }
                                );

                                if (!response.ok) {
                                  if (response.status === 401) {
                                    Cookies.remove("access_token");
                                    router.push("/");
                                    throw new Error(
                                      "Session expired. Please login again."
                                    );
                                  }
                                  throw new Error(`Failed to ${endpoint} blog`);
                                }

                                // Update the local state to reflect the change
                                setBlogs(
                                  blogs.map((b) =>
                                    b.id === blog.id
                                      ? { ...b, isHidden: !b.isHidden }
                                      : b
                                  )
                                );

                                toast.success(
                                  `Blog ${
                                    blog.isHidden ? "published" : "hidden"
                                  } successfully`
                                );
                              } catch (err) {
                                toast.error(
                                  err instanceof Error
                                    ? err.message
                                    : `Failed to ${
                                        blog.isHidden ? "unhide" : "hide"
                                      } blog`
                                );
                              }
                            }}
                          >
                            {blog.isHidden ? (
                              <IconEye className="size-3.5" />
                            ) : (
                              <IconEyeOff className="size-3.5" />
                            )}
                            <span className="sr-only">
                              {blog.isHidden ? "Show" : "Hide"}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => {
                              router.push(`/blogs/edit/${blog.id}`);
                            }}
                          >
                            <IconPencil className="size-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => {
                              setDeletingBlog(blog);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <IconTrash className="size-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div>
                            {format(new Date(blog.createdAt), "MMM d, yyyy")}
                          </div>
                          <div>{blog.readingTime}</div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={pagination?.links.prev ?? "#"}
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: pagination?.totalPages || 1 },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href={pagination?.links.self}
                            isActive={page === pagination?.currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext href={pagination?.links.next ?? "#"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Blog:{" "}
              <span className="font-medium text-foreground">
                {deletingBlog?.title}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const accessToken = Cookies.get("access_token");
                  if (!accessToken) {
                    throw new Error("No access token found");
                  }

                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog/${deletingBlog?.id}`,
                    {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (!response.ok) {
                    if (response.status === 401) {
                      Cookies.remove("access_token");
                      router.push("/login");
                      throw new Error("Session expired. Please login again.");
                    }
                    throw new Error("Failed to delete blog");
                  }

                  // Update the local state to remove the deleted blog
                  setBlogs(blogs.filter((b) => b.id !== deletingBlog?.id));
                  toast.success("Blog deleted successfully");
                  setIsDeleteModalOpen(false);
                } catch (err) {
                  toast.error(
                    err instanceof Error ? err.message : "Failed to delete blog"
                  );
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
