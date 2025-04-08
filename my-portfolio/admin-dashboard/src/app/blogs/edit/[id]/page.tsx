"use client";

import BlogEditor from "@/components/Editor/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MantineProvider } from "@mantine/core";
import Cookies from "js-cookie";
import { Plus, Trash2, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Tag {
  id: string;
  label: string;
}

interface CoverImage {
  url: string;
  publicId: string;
}

interface Blog {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string;
  isHidden: boolean;
  tags: Tag[];
}

interface BlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

export default function EditBlogPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<CoverImage | null>(null);
  const [imageError, setImageError] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const isDarkMode = theme === "dark";
  const [newTagLabel, setNewTagLabel] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        const accessToken = Cookies.get("access_token");

        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog/${params.id}`,
          {
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
          throw new Error("Failed to fetch blog");
        }

        const data: BlogResponse = await response.json();
        setBlog(data.data);
        setContent(data.data.content);
        setTitle(data.data.title);
        setDescription(data.data.description);
        setCoverImage({ url: data.data.image_url, publicId: "" });
        setSelectedTags(data.data.tags);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching blog"
        );
        toast.error("Failed to fetch blog");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/tags`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setAvailableTags(data.data);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
        toast.error("Failed to fetch tags");
      }
    };

    fetchBlog();
    fetchTags();
  }, [params.id, router]);

  const handleAddTag = (tag: Tag) => {
    if (selectedTags.length >= 3) {
      toast.error("Maximum 3 tags allowed");
      return;
    }
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  const handleUpdate = async () => {
    if (!title || !description || !content || !coverImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUpdating(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            title,
            description,
            content,
            tags: selectedTags.map((tag) => tag.id),
            image_url: coverImage.url,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Blog updated successfully");
        router.push("/blogs");
      } else {
        throw new Error(data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagLabel.trim()) {
      toast.error("Tag label cannot be empty");
      return;
    }

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/tags`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ label: newTagLabel.trim() }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setAvailableTags([...availableTags, data.data]);
        setNewTagLabel("");
        setIsCreatingTag(false);
        toast.success("Tag created successfully");
      } else {
        throw new Error(data.message || "Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      toast.error("Failed to create tag");
    }
  };

  const handleUpdateTag = async (tag: Tag) => {
    if (!tag.label.trim()) {
      toast.error("Tag label cannot be empty");
      return;
    }

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/tags/${tag.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ label: tag.label.trim() }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setAvailableTags(
          availableTags.map((t) => (t.id === tag.id ? data.data : t))
        );
        setEditingTag(null);
        toast.success("Tag updated successfully");
      } else {
        throw new Error(data.message || "Failed to update tag");
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      toast.error("Failed to update tag");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/tags/${tagId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setAvailableTags(availableTags.filter((tag) => tag.id !== tagId));
        setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
        toast.success("Tag deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast.error("Failed to delete tag");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading blog...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-destructive">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <MantineProvider defaultColorScheme={theme === "dark" ? "dark" : "light"}>
      <div className="h-screen bg-background overflow-hidden">
        <div className="w-full h-full mx-auto p-4 md:p-6 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Edit Blog Post
              </h1>
              <p className="text-muted-foreground text-sm">
                Update your blog post details below
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                onClick={() => router.push("/blogs")}
                className="flex-1 md:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 md:flex-none"
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - Form Fields */}
            <div className="xl:col-span-1">
              <div className="space-y-6">
                <div className="space-y-4 bg-card p-4 md:p-6 rounded-lg border shadow-sm">
                  <h2 className="text-lg font-semibold mb-4">Post Details</h2>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <textarea
                      id="title"
                      placeholder="Enter blog title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full min-h-[100px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      placeholder="Enter blog description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full min-h-[150px] p-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-card p-4 md:p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Tags</h2>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Tags
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Available Tags</h4>
                            {!isCreatingTag && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsCreatingTag(true)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                New Tag
                              </Button>
                            )}
                          </div>

                          {isCreatingTag && (
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Enter tag name"
                                value={newTagLabel}
                                onChange={(e) => setNewTagLabel(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleCreateTag();
                                  }
                                }}
                              />
                              <Button size="sm" onClick={handleCreateTag}>
                                Add
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setIsCreatingTag(false);
                                  setNewTagLabel("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {availableTags
                              .filter(
                                (tag) =>
                                  !selectedTags.find((t) => t.id === tag.id)
                              )
                              .map((tag) => (
                                <Badge
                                  key={tag.id}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-secondary"
                                  onClick={() => handleAddTag(tag)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {tag.label}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.label}
                        <button
                          onClick={() => removeTag(tag.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 bg-card p-4 md:p-6 rounded-lg border shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Cover Image</h2>
                    {coverImage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCoverImage(null)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <CldUploadWidget
                    uploadPreset="images_preset"
                    onSuccess={(result: any) => {
                      if (result.info) {
                        setCoverImage({
                          url: result.info.secure_url,
                          publicId: result.info.public_id,
                        });
                        setImageError("");
                      }
                    }}
                  >
                    {({ open }) => (
                      <div
                        onClick={() => open()}
                        className={`cursor-pointer rounded-xl ${
                          !coverImage
                            ? "border-2 border-dashed p-8 text-center hover:border-blue-500 transition-all duration-200"
                            : ""
                        } ${
                          !coverImage && isDarkMode
                            ? "border-gray-700 hover:border-blue-400"
                            : "border-gray-200"
                        }`}
                      >
                        {coverImage ? (
                          <div className="relative w-full h-[200px] rounded-lg overflow-hidden group">
                            <Image
                              src={coverImage.url}
                              alt="Cover image"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white text-sm">
                                Click to change image
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload
                              className={`mx-auto h-12 w-12 ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            />
                            <p
                              className={`mt-3 text-sm font-medium ${
                                isDarkMode ? "text-gray-200" : "text-gray-900"
                              }`}
                            >
                              Click to upload
                            </p>
                            <p
                              className={`mt-1 text-xs ${
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              SVG, PNG, JPG or GIF (max. 4MB)
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                  {imageError && (
                    <p className="text-sm text-red-500">{imageError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Editor */}
            <div className="xl:col-span-3">
              <div className="bg-card p-4 md:p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Content Editor</h2>
                <BlogEditor
                  content={content}
                  onChange={(editor) => setContent(editor.getHTML())}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}

const styles = `
  @layer utilities {
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
