"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
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

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editedSkill, setEditedSkill] = useState<Skill | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({
    label: "",
    url: "",
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get<SkillsResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setSkills(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch skills");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setEditedSkill(skill);
    setIsEditModalOpen(true);
    setHasChanges(false);
  };

  const handleInputChange = (field: keyof Skill, value: string) => {
    if (editedSkill) {
      const updatedSkill = { ...editedSkill, [field]: value };
      setEditedSkill(updatedSkill);
      setHasChanges(
        updatedSkill.label !== editingSkill?.label ||
          updatedSkill.url !== editingSkill?.url
      );
    }
  };

  const handleUpdate = async () => {
    if (!editedSkill) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills/${editedSkill.id}`,
        {
          label: editedSkill.label,
          url: editedSkill.url,
          portfolioId: editedSkill.portfolioId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSkills(
          skills.map((skill) =>
            skill.id === editedSkill.id ? editedSkill : skill
          )
        );
        toast.success("Skill updated successfully");
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update skill");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update skill"
      );
    }
  };

  const handleDiscard = () => {
    setEditedSkill(editingSkill);
    setHasChanges(false);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setEditingSkill(null);
    setEditedSkill(null);
    setHasChanges(false);
  };

  const handleDeleteClick = (skill: Skill) => {
    setDeletingSkill(skill);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSkill) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills/${deletingSkill.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setSkills(skills.filter((skill) => skill.id !== deletingSkill.id));
        toast.success("Skill deleted successfully");
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to delete skill");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete skill"
      );
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setNewSkill({ label: "", url: "" });
  };

  const handleAddSkill = async () => {
    if (!newSkill.label || !newSkill.url) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/skills`,
        {
          label: newSkill.label,
          url: newSkill.url,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSkills([...skills, response.data.data]);
        toast.success("Skill added successfully");
        setIsAddModalOpen(false);
        setNewSkill({ label: "", url: "" });
      } else {
        throw new Error(response.data.message || "Failed to add skill");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add skill");
    }
  };

  const LoadingSkeleton = () => (
    <div className="rounded-md border">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[100px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          ))}
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
        <SiteHeader label="Skills" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Skills</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddClick}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Skill</span>
                  </Button>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">Label</TableHead>
                          <TableHead className="w-[50%]">URL</TableHead>
                          <TableHead className="w-[10%] text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {skills.map((skill) => (
                          <TableRow key={skill.id}>
                            <TableCell className="font-medium">
                              {skill.label}
                            </TableCell>
                            <TableCell>
                              <a
                                href={skill.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {skill.url}
                              </a>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <IconDotsVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(skill)}
                                  >
                                    <IconPencil className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(skill)}
                                    className="text-red-600"
                                  >
                                    <IconTrash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>
              Make changes to the skill details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={editedSkill?.label || ""}
                onChange={(e) => handleInputChange("label", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={editedSkill?.url || ""}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            {hasChanges ? (
              <>
                <Button variant="outline" onClick={handleDiscard}>
                  Discard
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this skill? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Skill:{" "}
              <span className="font-medium text-foreground">
                {deletingSkill?.label}
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
      </Dialog>

      <Dialog open={isAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new skill.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-label">Label</Label>
              <Input
                id="new-label"
                value={newSkill.label}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, label: e.target.value })
                }
                placeholder="Enter skill label"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-url">URL</Label>
              <Input
                id="new-url"
                value={newSkill.url}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, url: e.target.value })
                }
                placeholder="Enter skill URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
