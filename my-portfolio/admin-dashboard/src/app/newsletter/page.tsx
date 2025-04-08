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
import { IconPlus, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface Links {
  first: string;
  last: string;
  next: string | null;
  prev: string | null;
}

interface NewsletterResponse {
  statusCode: number;
  data: {
    newsletters: Newsletter[];
    pagination: Pagination;
    links: Links;
  };
  message: string;
  success: boolean;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNewsletter, setDeletingNewsletter] =
    useState<Newsletter | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchNewsletters();
  }, [currentPage]);

  const fetchNewsletters = async () => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get<NewsletterResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/newsletter?page=${currentPage}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setNewsletters(response.data.data.newsletters);
        setTotalPages(response.data.data.pagination.totalPages);
      } else {
        throw new Error(response.data.message || "Failed to fetch newsletters");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to fetch newsletters");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (newsletter: Newsletter) => {
    setDeletingNewsletter(newsletter);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingNewsletter) return;

    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/newsletter/${deletingNewsletter.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.success) {
        setNewsletters(
          newsletters.filter((n) => n.id !== deletingNewsletter.id)
        );
        toast.success("Newsletter deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to delete newsletter");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete newsletter"
      );
    }
  };

  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddNewsletter = async () => {
    if (!newEmail) {
      toast.error("Please enter an email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/newsletter`,
        {
          email: newEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Newsletter added successfully");
        setNewEmail("");
        setIsAddDialogOpen(false);
        fetchNewsletters(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Failed to add newsletter");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add newsletter"
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
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="border-b p-4">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-[200px]" />
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
        <SiteHeader label="Newsletter" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddClick}
                  >
                    <IconPlus className="h-4 w-4" />
                    <span className="sr-only">Add Subscriber</span>
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
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribed On</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newsletters.map((newsletter) => (
                          <TableRow key={newsletter.id}>
                            <TableCell>{newsletter.email}</TableCell>
                          <TableCell>
                              {new Date(
                                newsletter.createdAt
                              ).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(newsletter)}
                              >
                                <IconTrash className="h-4 w-4 text-red-500" />
                                </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}
                {!loading && !error && newsletters.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
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
            <DialogTitle>Delete Newsletter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this newsletter subscription? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Email:{" "}
              <span className="font-medium text-foreground">
                {deletingNewsletter?.email}
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
            <DialogTitle>Add Newsletter Subscriber</DialogTitle>
            <DialogDescription>
              Enter the email address of the new subscriber.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="subscriber@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewsletter} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Subscriber"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
