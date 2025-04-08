"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconDotsVertical,
  IconExternalLink,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
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

interface ProjectsResponse {
  statusCode: number;
  data: Project[];
  message: string;
  success: boolean;
}

interface SkillsResponse {
  statusCode: number;
  data: Skill[];
  message: string;
  success: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    image_url: "",
    web_url: "",
    skills: [] as string[],
  });

  // Date picker states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(
    undefined
  );
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        // Fetch projects
        const projectsResponse = await axios.get<ProjectsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/projects`,
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

        if (projectsResponse.data.success) {
          setProjects(projectsResponse.data.data);
        } else {
          throw new Error(
            projectsResponse.data.message || "Failed to fetch projects"
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
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (project: Project) => {
    router.push(`/projects/edit/${project.id}`);
  };

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
        updatedProject.name !== editingProject?.name ||
          updatedProject.description !== editingProject?.description ||
          updatedProject.startDate !== editingProject?.startDate ||
          updatedProject.endDate !== editingProject?.endDate ||
          updatedProject.image_url !== editingProject?.image_url ||
          updatedProject.web_url !== editingProject?.web_url
      );
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
        setProjects(
          projects.map((project) =>
            project.id === editedProject.id ? editedProject : project
          )
        );
        toast.success("Project updated successfully");
        setIsEditModalOpen(false);
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
    setEditedProject(editingProject);
    setHasChanges(false);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
    setEditedProject(null);
    setHasChanges(false);
  };

  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/projects/${deletingProject.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setProjects(
          projects.filter((project) => project.id !== deletingProject.id)
        );
        toast.success("Project deleted successfully");
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to delete project");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete project"
      );
    }
  };

  const handleAddClick = () => {
    router.push("/projects/create");
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
        setProjects([...projects, response.data.data]);
        toast.success("Project added successfully");
        setIsAddModalOpen(false);
        setNewProject({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          image_url: "",
          web_url: "",
          skills: [],
        });
        setStartDate(undefined);
        setEndDate(undefined);
      } else {
        throw new Error(response.data.message || "Failed to add project");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add project");
    }
  };

  const toggleSkillInEdit = (skillId: string) => {
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

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
            <Skeleton className="h-4 w-4/6 mt-2" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
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
        <SiteHeader label="Projects" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Projects</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddClick}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Project</span>
                  </Button>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-muted-foreground mb-2">
                      No Projects Available
                    </div>
                    <Button variant="outline" onClick={handleAddClick}>
                      <IconPlus className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="overflow-hidden">
                        <div className="relative h-48 w-full">
                          <img
                            src={project.image_url}
                            alt={project.name}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm"
                                >
                                  <span className="sr-only">Open menu</span>
                                  <IconDotsVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditClick(project)}
                                >
                                  <IconPencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(project)}
                                  className="text-red-600"
                                >
                                  <IconTrash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle>{project.name}</CardTitle>
                          <CardDescription>
                            {project.description.length > 100
                              ? `${project.description.substring(0, 100)}...`
                              : project.description}
                          </CardDescription>
                          <div className="text-xs text-muted-foreground mt-1">
                            {project.startDate} - {project.endDate}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs bg-muted rounded-full"
                              >
                                {skill.label}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={project.web_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <IconExternalLink className="h-4 w-4 mr-1" />
                                View
                              </a>
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Sheet open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Project:{" "}
              <span className="font-medium text-foreground">
                {deletingProject?.name}
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
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Sheet>
    </SidebarProvider>
  );
}
