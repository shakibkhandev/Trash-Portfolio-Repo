"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  status: string;
  portfolioId: string;
}

interface EducationResponse {
  statusCode: number;
  data: Education[];
  message: string;
  success: boolean;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [editedEducation, setEditedEducation] = useState<Education | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [deletingEducation, setDeletingEducation] = useState<Education | null>(
    null
  );
  const [newEducation, setNewEducation] = useState({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editStartDate, setEditStartDate] = useState<Date | undefined>(
    undefined
  );
  const [editEndDate, setEditEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await axios.get<EducationResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/education`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.success) {
          setEducation(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to fetch education");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to fetch education");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, []);

  const handleEditClick = (education: Education) => {
    setEditingEducation(education);
    setEditedEducation(education);

    // Parse dates for the date picker
    try {
      const startDateParts = education.startDate.split(" ");
      const endDateParts = education.endDate.split(" ");

      if (startDateParts.length === 3) {
        const startDay = parseInt(startDateParts[0]);
        const startMonth = new Date(
          Date.parse(startDateParts[1] + " 1, 2012")
        ).getMonth();
        const startYear = parseInt(startDateParts[2]);
        setEditStartDate(new Date(startYear, startMonth, startDay));
      }

      if (endDateParts.length === 3) {
        const endDay = parseInt(endDateParts[0]);
        const endMonth = new Date(
          Date.parse(endDateParts[1] + " 1, 2012")
        ).getMonth();
        const endYear = parseInt(endDateParts[2]);
        setEditEndDate(new Date(endYear, endMonth, endDay));
      }
    } catch (error) {
      console.error("Error parsing dates:", error);
    }

    setIsEditModalOpen(true);
    setHasChanges(false);
  };

  const handleInputChange = (field: keyof Education, value: string) => {
    if (editedEducation) {
      const updatedEducation = { ...editedEducation, [field]: value };
      setEditedEducation(updatedEducation);
      setHasChanges(
        updatedEducation.institution !== editingEducation?.institution ||
          updatedEducation.degree !== editingEducation?.degree ||
          updatedEducation.startDate !== editingEducation?.startDate ||
          updatedEducation.endDate !== editingEducation?.endDate ||
          updatedEducation.status !== editingEducation?.status
      );
    }
  };

  const handleUpdate = async () => {
    if (!editedEducation) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/education/${editedEducation.id}`,
        {
          institution: editedEducation.institution,
          degree: editedEducation.degree,
          startDate: editedEducation.startDate,
          endDate: editedEducation.endDate,
          status: editedEducation.status,
          portfolioId: editedEducation.portfolioId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setEducation(
          education.map((edu) =>
            edu.id === editedEducation.id ? editedEducation : edu
          )
        );
        toast.success("Education updated successfully");
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update education");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update education"
      );
    }
  };

  const handleDiscard = () => {
    setEditedEducation(editingEducation);
    setHasChanges(false);
  };

  const handleClose = () => {
    setIsEditModalOpen(false);
    setEditingEducation(null);
    setEditedEducation(null);
    setHasChanges(false);
  };

  const handleDeleteClick = (education: Education) => {
    setDeletingEducation(education);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingEducation) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/education/${deletingEducation.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setEducation(
          education.filter((edu) => edu.id !== deletingEducation.id)
        );
        toast.success("Education deleted successfully");
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to delete education");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete education"
      );
    }
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
    setNewEducation({
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      status: "",
    });
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleAddEducation = async () => {
    if (
      !newEducation.institution ||
      !newEducation.degree ||
      !startDate ||
      !endDate ||
      !newEducation.status
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Format dates as "DD MMM YYYY"
      const formattedStartDate = format(startDate, "dd MMM yyyy");
      const formattedEndDate = format(endDate, "dd MMM yyyy");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/education`,
        {
          institution: newEducation.institution,
          degree: newEducation.degree,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          status: newEducation.status,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setEducation([...education, response.data.data]);
        toast.success("Education added successfully");
        setIsAddModalOpen(false);
        setNewEducation({
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          status: "",
        });
        setStartDate(undefined);
        setEndDate(undefined);
      } else {
        throw new Error(response.data.message || "Failed to add education");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add education"
      );
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

  const CardSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:hidden">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[120px]" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const EducationCard = ({ education }: { education: Education }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{education.institution}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {education.degree}
          </span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Start:</span>{" "}
            {new Date(education.startDate).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">End:</span>{" "}
            {new Date(education.endDate).toLocaleDateString()}
          </div>
        </div>
        <p className="text-sm">
          Status:{" "}
          <span className="font-medium text-primary">{education.status}</span>
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditClick(education)}>
              <IconPencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(education)}
              className="text-red-600"
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
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
        <SiteHeader label="Education" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Education</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddClick}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Education</span>
                  </Button>
                </div>
                {loading ? (
                  <>
                    <div className="hidden lg:block">
                      <LoadingSkeleton />
                    </div>
                    <CardSkeleton />
                  </>
                ) : error ? (
                  <div className="text-center text-red-500 py-4">{error}</div>
                ) : (
                  <>
                    {/* Table View - Large Screens */}
                    <div className="hidden lg:block">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[25%]">
                                Institution
                              </TableHead>
                              <TableHead className="w-[25%]">Degree</TableHead>
                              <TableHead className="w-[15%]">
                                Start Date
                              </TableHead>
                              <TableHead className="w-[15%]">
                                End Date
                              </TableHead>
                              <TableHead className="w-[10%]">Status</TableHead>
                              <TableHead className="w-[10%] text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {education.map((edu) => (
                              <TableRow key={edu.id}>
                                <TableCell className="font-medium">
                                  {edu.institution}
                                </TableCell>
                                <TableCell>{edu.degree}</TableCell>
                                <TableCell>
                                  {new Date(edu.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {new Date(edu.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{edu.status}</TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <IconDotsVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleEditClick(edu)}
                                      >
                                        <IconPencil className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteClick(edu)}
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
                    </div>

                    {/* Card View - Medium Screens */}
                    <div className="grid gap-4 md:grid-cols-2 lg:hidden">
                      {education.map((edu) => (
                        <EducationCard key={edu.id} education={edu} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Education</DialogTitle>
            <DialogDescription>
              Make changes to the education details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={editedEducation?.institution || ""}
                onChange={(e) =>
                  handleInputChange("institution", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={editedEducation?.degree || ""}
                onChange={(e) => handleInputChange("degree", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
                    onSelect={(date) => {
                      setEditStartDate(date);
                      if (date && editedEducation) {
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
                    onSelect={(date) => {
                      setEditEndDate(date);
                      if (date && editedEducation) {
                        const formattedDate = format(date, "dd MMM yyyy");
                        handleInputChange("endDate", formattedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedEducation?.status || ""}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pursuing">Pursuing</SelectItem>
                </SelectContent>
              </Select>
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
            <DialogTitle>Delete Education</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this education entry? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Institution:{" "}
              <span className="font-medium text-foreground">
                {deletingEducation?.institution}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Degree:{" "}
              <span className="font-medium text-foreground">
                {deletingEducation?.degree}
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
            <DialogTitle>Add New Education</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new education entry.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-institution">Institution</Label>
              <Input
                id="new-institution"
                value={newEducation.institution}
                onChange={(e) =>
                  setNewEducation({
                    ...newEducation,
                    institution: e.target.value,
                  })
                }
                placeholder="Enter institution name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-degree">Degree</Label>
              <Input
                id="new-degree"
                value={newEducation.degree}
                onChange={(e) =>
                  setNewEducation({ ...newEducation, degree: e.target.value })
                }
                placeholder="Enter degree"
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
                    onSelect={setStartDate}
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
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-status">Status</Label>
              <Select
                value={newEducation.status}
                onValueChange={(value) =>
                  setNewEducation({ ...newEducation, status: value })
                }
              >
                <SelectTrigger id="new-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pursuing">Pursuing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEducation}>Add Education</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
