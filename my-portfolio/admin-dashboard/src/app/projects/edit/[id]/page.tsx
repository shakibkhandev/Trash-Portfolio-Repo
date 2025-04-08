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
import { IconCalendar } from "@tabler/icons-react";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { Upload } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Skill {
  id: string;
  label: string;
  url: string;
  portfolioId: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  image_url: string;
  web_url: string;
  portfolioId: string;
  skills: Skill[];
}

interface SkillsResponse {
  statusCode: number;
  data: Skill[];
  message: string;
  success: boolean;
}

interface ProjectResponse {
  statusCode: number;
  data: Project;
  message: string;
  success: boolean;
}

export default function EditProjectPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [imageError, setImageError] = useState("");
  const isDarkMode = theme === "dark";
  const [project, setProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        // Fetch project
        const projectResponse = await axios.get<ProjectResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Fetch skills
        const skillsResponse = await axios.get<SkillsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (projectResponse.data.success) {
          setProject(projectResponse.data.data);
          setEditedProject(projectResponse.data.data);

          // Parse dates for the date picker
          try {
            const startDateParts =
              projectResponse.data.data.startDate.split(" ");
            if (startDateParts.length === 3) {
              const startDateObj = new Date(
                `${startDateParts[2]}-${getMonthNumber(startDateParts[1])}-${
                  startDateParts[0]
                }`
              );
              setStartDate(startDateObj);
            }

            const endDateParts = projectResponse.data.data.endDate.split(" ");
            if (endDateParts.length === 3) {
              const endDateObj = new Date(
                `${endDateParts[2]}-${getMonthNumber(endDateParts[1])}-${
                  endDateParts[0]
                }`
              );
              setEndDate(endDateObj);
            }
          } catch (error) {
            console.error("Error parsing dates:", error);
          }
        } else {
          throw new Error(
            projectResponse.data.message || "Failed to fetch project"
          );
        }

        if (skillsResponse.data.success) {
          setSkills(skillsResponse.data.data);
        } else {
          throw new Error(
            skillsResponse.data.message || "Failed to fetch skills"
          );
        }
      } catch (err) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const getMonthNumber = (monthName: string): string => {
    const months: { [key: string]: string } = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    return months[monthName] || "01";
  };

  const handleInputChange = (field: keyof Project, value: string) => {
    if (editedProject) {
      const updatedProject = { ...editedProject, [field]: value };
      setEditedProject(updatedProject);
      setHasChanges(
        updatedProject.name !== project?.name ||
          updatedProject.description !== project?.description ||
          updatedProject.startDate !== project?.startDate ||
          updatedProject.endDate !== project?.endDate ||
          updatedProject.image_url !== project?.image_url ||
          updatedProject.web_url !== project?.web_url
      );
    }
  };

  const toggleSkill = (skillId: string) => {
    if (editedProject) {
      const skillExists = editedProject.skills.some(
        (skill) => skill.id === skillId
      );

      if (skillExists) {
        // Remove skill
        setEditedProject({
          ...editedProject,
          skills: editedProject.skills.filter((skill) => skill.id !== skillId),
        });
      } else {
        // Add skill
        const skillToAdd = skills.find((skill) => skill.id === skillId);
        if (skillToAdd) {
          setEditedProject({
            ...editedProject,
            skills: [...editedProject.skills, skillToAdd],
          });
        }
      }

      setHasChanges(true);
    }
  };

  const handleUpdate = async () => {
    if (!editedProject) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/projects/${editedProject.id}`,
        {
          name: editedProject.name,
          description: editedProject.description,
          startDate: editedProject.startDate,
          endDate: editedProject.endDate,
          image_url: editedProject.image_url,
          web_url: editedProject.web_url,
          skills: editedProject.skills.map((skill) => skill.id),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Project updated successfully");
        router.push("/projects");
      } else {
        throw new Error(response.data.message || "Failed to update project");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update project"
      );
    }
  };

  const handleDiscard = () => {
    setEditedProject(project);
    setHasChanges(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project || !editedProject) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editedProject.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editedProject.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
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
                      if (date && editedProject) {
                        const formattedDate = format(date, "dd MMM yyyy");
                        handleInputChange("startDate", formattedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
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
                      if (date && editedProject) {
                        const formattedDate = format(date, "dd MMM yyyy");
                        handleInputChange("endDate", formattedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="web_url">Web URL</Label>
            <Input
              id="web_url"
              value={editedProject.web_url}
              onChange={(e) => handleInputChange("web_url", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image_url">Image</Label>
            <CldUploadWidget
              uploadPreset="images_preset"
              onSuccess={(result: any) => {
                if (result.info) {
                  handleInputChange("image_url", result.info.secure_url);
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
                    !editedProject.image_url
                      ? "border-2 border-dashed p-8 text-center hover:border-blue-500 transition-all duration-200"
                      : ""
                  } ${
                    !editedProject.image_url && isDarkMode
                      ? "border-gray-700 hover:border-blue-400"
                      : "border-gray-200"
                  }`}
                >
                  {editedProject.image_url ? (
                    <div className="relative w-full h-[200px] rounded-lg overflow-hidden group">
                      <Image
                        src={editedProject.image_url}
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
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const isSelected = editedProject.skills.some(
                  (s) => s.id === skill.id
                );
                return (
                  <Button
                    key={skill.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    {skill.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          {hasChanges ? (
            <>
              <Button variant="outline" onClick={handleDiscard}>
                Discard
              </Button>
              <Button onClick={handleUpdate}>Update</Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/projects")}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
