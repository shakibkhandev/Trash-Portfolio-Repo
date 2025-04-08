"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import {
  IconCalendar,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface WorkExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  portfolioId: string;
}

interface WorkExperienceResponse {
  statusCode: number;
  data: WorkExperience[];
  message: string;
  success: boolean;
}

export default function WorkExperiencePage() {
  const router = useRouter();
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingWorkExperience, setDeletingWorkExperience] =
    useState<WorkExperience | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWorkExperience, setEditingWorkExperience] =
    useState<WorkExperience | null>(null);
  const [newWorkExperience, setNewWorkExperience] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    portfolioId: "cm94zsahc0000s0dk0vmn04ip", // Default portfolio ID
  });
  const [editedWorkExperience, setEditedWorkExperience] = useState({
    companyName: "",
    position: "",
    startDate: "",
    endDate: "",
    portfolioId: "cm94zsahc0000s0dk0vmn04ip", // Default portfolio ID
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Date picker states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(
    undefined
  );
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get<WorkExperienceResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/work-experience`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setWorkExperiences(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch work experiences"
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch work experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (workExperience: WorkExperience) => {
    setDeletingWorkExperience(workExperience);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingWorkExperience) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/work-experience/${deletingWorkExperience.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setWorkExperiences(
          workExperiences.filter((w) => w.id !== deletingWorkExperience.id)
        );
        toast.success("Work experience deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error(
          response.data.message || "Failed to delete work experience"
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete work experience"
      );
    }
  };

  const handleAddClick = () => {
    setNewWorkExperience({
      companyName: "",
      position: "",
      startDate: "",
      endDate: "",
      portfolioId: "cm94zsahc0000s0dk0vmn04ip", // Default portfolio ID
    });
    setStartDate(undefined);
    setEndDate(undefined);
    setIsAddDialogOpen(true);
  };

  const handleEditClick = (workExperience: WorkExperience) => {
    setEditingWorkExperience(workExperience);
    setEditedWorkExperience({
      companyName: workExperience.companyName,
      position: workExperience.position,
      startDate: workExperience.startDate,
      endDate: workExperience.endDate,
      portfolioId: workExperience.portfolioId,
    });

    // Parse dates for the date picker
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split(" ");
      const monthMap: { [key: string]: number } = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sep: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };
      return new Date(parseInt(year), monthMap[month], parseInt(day));
    };

    setEditStartDate(parseDate(workExperience.startDate));
    setEditEndDate(parseDate(workExperience.endDate));

    setIsEditDialogOpen(true);
  };

  const handleAddWorkExperience = async () => {
    if (
      !newWorkExperience.companyName ||
      !newWorkExperience.position ||
      !startDate ||
      !endDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Format dates as "DD MMM YYYY"
      const formattedStartDate = format(startDate, "dd MMM yyyy");
      const formattedEndDate = format(endDate, "dd MMM yyyy");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/work-experience`,
        {
          ...newWorkExperience,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Work experience added successfully");
        setNewWorkExperience({
          companyName: "",
          position: "",
          startDate: "",
          endDate: "",
          portfolioId: "cm94zsahc0000s0dk0vmn04ip", // Default portfolio ID
        });
        setStartDate(undefined);
        setEndDate(undefined);
        setIsAddDialogOpen(false);
        fetchWorkExperiences(); // Refresh the list
      } else {
        throw new Error(
          response.data.message || "Failed to add work experience"
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add work experience"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWorkExperience = async () => {
    if (!editingWorkExperience) return;

    if (
      !editedWorkExperience.companyName ||
      !editedWorkExperience.position ||
      !editStartDate ||
      !editEndDate
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Format dates as "DD MMM YYYY"
      const formattedStartDate = format(editStartDate, "dd MMM yyyy");
      const formattedEndDate = format(editEndDate, "dd MMM yyyy");

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/work-experience/${editingWorkExperience.id}`,
        {
          ...editedWorkExperience,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Work experience updated successfully");
        setIsEditDialogOpen(false);
        fetchWorkExperiences(); // Refresh the list
      } else {
        throw new Error(
          response.data.message || "Failed to update work experience"
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update work experience"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="border rounded-lg">
        <div className="border-b p-4">
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="border-b p-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        ))}
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
        <SiteHeader label="Work Experience" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Work Experience</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddClick}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Experience</span>
                  </Button>
                </div>
                {loading ? (
                  <LoadingSkeleton />
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workExperiences.map((workExperience) => (
                          <TableRow key={workExperience.id}>
                            <TableCell>{workExperience.companyName}</TableCell>
                            <TableCell>{workExperience.position}</TableCell>
                            <TableCell>
                              {workExperience.startDate} -{" "}
                              {workExperience.endDate}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleEditClick(workExperience)
                                  }
                                >
                                  <IconPencil className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteClick(workExperience)
                                  }
                                >
                                  <IconTrash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Work Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this work experience? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Company:{" "}
              <span className="font-medium text-foreground">
                {deletingWorkExperience?.companyName}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Position:{" "}
              <span className="font-medium text-foreground">
                {deletingWorkExperience?.position}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Work Experience</DialogTitle>
            <DialogDescription>
              Enter the details of the work experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={newWorkExperience.companyName}
                onChange={(e) =>
                  setNewWorkExperience({
                    ...newWorkExperience,
                    companyName: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newWorkExperience.position}
                onChange={(e) =>
                  setNewWorkExperience({
                    ...newWorkExperience,
                    position: e.target.value,
                  })
                }
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
                        "justify-start text-left font-normal",
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
                      onSelect={setStartDate}
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
                        "justify-start text-left font-normal",
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
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWorkExperience} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Work Experience</DialogTitle>
            <DialogDescription>
              Update the details of the work experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-companyName">Company Name</Label>
              <Input
                id="edit-companyName"
                value={editedWorkExperience.companyName}
                onChange={(e) =>
                  setEditedWorkExperience({
                    ...editedWorkExperience,
                    companyName: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-position">Position</Label>
              <Input
                id="edit-position"
                value={editedWorkExperience.position}
                onChange={(e) =>
                  setEditedWorkExperience({
                    ...editedWorkExperience,
                    position: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editStartDate && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {editStartDate
                        ? format(editStartDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editStartDate}
                      onSelect={setEditStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editEndDate && "text-muted-foreground"
                      )}
                    >
                      <IconCalendar className="mr-2 h-4 w-4" />
                      {editEndDate ? format(editEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editEndDate}
                      onSelect={setEditEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateWorkExperience}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Experience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
