"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IconCalendar, IconX } from "@tabler/icons-react";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Skill {
  id: string;
  label: string;
  url: string;
  portfolioId: string;
}

interface SkillsResponse {
  statusCode: number;
  data: Skill[];
  message: string;
  success: boolean;
}

export default function CreateProjectPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [imageError, setImageError] = useState("");
  const isDarkMode = theme === "dark";
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    image_url: "",
    web_url: "",
    skills: [] as string[],
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const skillsResponse = await axios.get<SkillsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (skillsResponse.data.success) {
          setSkills(skillsResponse.data.data);
        } else {
          throw new Error(
            skillsResponse.data.message || "Failed to fetch skills"
          );
        }
      } catch (err) {
        toast.error("Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const toggleSkillInNew = (skillId: string) => {
    const skillExists = newProject.skills.includes(skillId);

    if (skillExists) {
      // Remove skill
      setNewProject({
        ...newProject,
        skills: newProject.skills.filter((id) => id !== skillId),
      });
    } else {
      // Add skill
      setNewProject({
        ...newProject,
        skills: [...newProject.skills, skillId],
      });
    }
  };

  const handleAddProject = async () => {
    if (
      !newProject.name ||
      !newProject.description ||
      !newProject.startDate ||
      !newProject.endDate ||
      !newProject.image_url ||
      !newProject.web_url
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/projects`,
        {
          name: newProject.name,
          description: newProject.description,
          startDate: newProject.startDate,
          endDate: newProject.endDate,
          image_url: newProject.image_url,
          web_url: newProject.web_url,
          skills: newProject.skills,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Project added successfully");
        router.push("/projects");
      } else {
        throw new Error(response.data.message || "Failed to add project");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add project");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Project</h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              value={newProject.name}
              onChange={(e) =>
                setNewProject({ ...newProject, name: e.target.value })
              }
              placeholder="Enter project name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-description">Description</Label>
            <Input
              id="new-description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              placeholder="Enter project description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <IconCalendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    if (date) {
                      const formattedDate = format(date, "dd MMM yyyy");
                      setNewProject({
                        ...newProject,
                        startDate: formattedDate,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <IconCalendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    if (date) {
                      const formattedDate = format(date, "dd MMM yyyy");
                      setNewProject({
                        ...newProject,
                        endDate: formattedDate,
                      });
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-image_url">Image</Label>
            <CldUploadWidget
              uploadPreset="images_preset"
              onSuccess={(result: any) => {
                if (result.info) {
                  setNewProject({
                    ...newProject,
                    image_url: result.info.secure_url,
                  });
                  setImageError("");
                  toast.success("Image uploaded successfully");
                }
              }}
              onError={(error: any) => {
                console.error("Upload error:", error);
                setImageError("Failed to upload image");
                toast.error("Failed to upload image");
              }}
            >
              {({ open }) => (
                <div
                  onClick={() => open()}
                  className={`cursor-pointer rounded-xl ${
                    !newProject.image_url
                      ? "border-2 border-dashed p-8 text-center hover:border-blue-500 transition-all duration-200"
                      : ""
                  } ${
                    !newProject.image_url && isDarkMode
                      ? "border-gray-700 hover:border-blue-400"
                      : "border-gray-200"
                  }`}
                >
                  {newProject.image_url ? (
                    <div className="relative w-full h-[200px] rounded-lg overflow-hidden group">
                      <Image
                        src={newProject.image_url}
                        alt="Project image"
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
            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-web_url">Web URL</Label>
            <Input
              id="new-web_url"
              value={newProject.web_url}
              onChange={(e) =>
                setNewProject({ ...newProject, web_url: e.target.value })
              }
              placeholder="Enter web URL"
            />
          </div>
          <div className="grid gap-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-md">
              {skills.length > 0 ? (
                skills.map((skill) => {
                  const isSelected = newProject.skills.includes(skill.id);
                  return (
                    <div
                      key={skill.id}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm cursor-pointer flex items-center gap-1 transition-colors",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                      onClick={() => toggleSkillInNew(skill.id)}
                    >
                      {skill.label}
                      {isSelected && <IconX className="h-3 w-3" />}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills available
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => router.push("/projects")}>
            Cancel
          </Button>
          <Button onClick={handleAddProject}>Create Project</Button>
        </div>
      </div>
    </div>
  );
}
