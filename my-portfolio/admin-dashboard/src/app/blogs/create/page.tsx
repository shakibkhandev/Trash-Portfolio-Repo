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
import { Pencil, Plus, Trash2, Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export default function page() {
  const { theme } = useTheme();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<CoverImage | null>(null);
  const [imageError, setImageError] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const isDarkMode = theme === "dark";
  const [newTagLabel, setNewTagLabel] = useState("");
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  useEffect(() => {
    // Fetch available tags
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

    fetchTags();
  }, []);

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

  const handlePublish = async () => {
    if (!title || !description || !content || !coverImage) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsPublishing(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/blogs/blog`,
        {
          method: "POST",
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
        toast.success("Blog published successfully");
        router.push("/blogs");
      } else {
        throw new Error(data.message || "Failed to publish blog");
      }
    } catch (error) {
      console.error("Error publishing blog:", error);
      toast.error("Failed to publish blog");
    } finally {
      setIsPublishing(false);
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

  return (
    <MantineProvider defaultColorScheme={theme === "dark" ? "dark" : "light"}>
      <div className="h-screen bg-background overflow-hidden">
        <div className="w-full h-full mx-auto p-4 md:p-6 overflow-y-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Create New Blog Post
              </h1>
              <p className="text-muted-foreground text-sm">
                Fill in the details below to create your new blog post
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
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 md:flex-none"
              >
                {isPublishing ? "Publishing..." : "Publish"}
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
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="px-3 py-1 text-sm cursor-pointer hover:bg-secondary/80"
                          onClick={() => removeTag(tag.id)}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                      {selectedTags.length < 3 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Add Tag
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
                                    onChange={(e) =>
                                      setNewTagLabel(e.target.value)
                                    }
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
                                {availableTags.map((tag) => (
                                  <div
                                    key={tag.id}
                                    className="flex items-center gap-1"
                                  >
                                    {editingTag?.id === tag.id ? (
                                      <div className="flex items-center gap-1">
                                        <Input
                                          value={editingTag.label}
                                          onChange={(e) =>
                                            setEditingTag({
                                              ...editingTag,
                                              label: e.target.value,
                                            })
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleUpdateTag(editingTag);
                                            }
                                          }}
                                          className="h-7 w-32"
                                        />
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleUpdateTag(editingTag)
                                          }
                                        >
                                          Save
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setEditingTag(null)}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    ) : (
                                      <>
                                        <Badge
                                          variant={
                                            selectedTags.find(
                                              (t) => t.id === tag.id
                                            )
                                              ? "secondary"
                                              : "outline"
                                          }
                                          className="cursor-pointer hover:bg-secondary"
                                          onClick={() => {
                                            if (
                                              selectedTags.find(
                                                (t) => t.id === tag.id
                                              )
                                            ) {
                                              removeTag(tag.id);
                                            } else {
                                              handleAddTag(tag);
                                            }
                                          }}
                                        >
                                          {tag.label}
                                        </Badge>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                          onClick={() => setEditingTag(tag)}
                                        >
                                          <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                          onClick={() =>
                                            handleDeleteTag(tag.id)
                                          }
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Image Section */}
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
