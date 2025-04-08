"use client";

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconEye,
  IconEyeOff,
  IconMail,
  IconPencil,
  IconSearch,
  IconTrash,
  IconTrendingUp,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { z } from "zod";

import blogsData from "@/app/dashboard/blogs.json";
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
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

export const schema = z.object({
  id: z.string(),
  email: z.string().email(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <IconMail className="size-4 text-muted-foreground/70" />
          <span className="font-medium text-muted-foreground/90">
            {row.original.email}
          </span>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                // Handle delete action here
                toast.promise(
                  new Promise((resolve) => setTimeout(resolve, 1000)),
                  {
                    loading: `Deleting ${row.original.email}`,
                    success: "Email deleted",
                    error: "Error deleting email",
                  }
                );
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [activeTab, setActiveTab] = React.useState("newsletter");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    table.getColumn("email")?.setFilterValue(debouncedSearchValue);
  }, [debouncedSearchValue, table]);

  return (
    <Tabs
      defaultValue="newsletter"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="blogs">Blogs</SelectItem>
            <SelectItem value="logs">Logs</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-4">
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <TabsContent
        value="newsletter"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="flex items-center justify-end">
          <div className="relative w-64">
            <IconSearch className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              placeholder="Search emails..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="h-8 pl-8"
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={header.id === "actions" ? "w-20" : ""}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="portfolio" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="blogs" className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogsData.data.map((blog) => (
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
                    onClick={() => {
                      // Handle hide/show
                      toast.success(
                        `Blog ${
                          blog.isHidden ? "published" : "hidden"
                        } successfully`
                      );
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
                      // Handle edit
                      toast.success("Edit blog clicked");
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
                      // Handle delete
                      toast.success("Delete blog clicked");
                    }}
                  >
                    <IconTrash className="size-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div>{format(new Date(blog.createdAt), "MMM d, yyyy")}</div>
                  <div>{blog.readingTime}</div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={blogsData.pagination.links.prev ?? "#"}
                />
              </PaginationItem>
              {Array.from(
                { length: blogsData.pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={blogsData.pagination.links.self}
                    isActive={page === blogsData.pagination.currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href={blogsData.pagination.links.next ?? "#"} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </TabsContent>
      <TabsContent value="logs" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.email}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.email}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue={item.email} />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type BlogTag = {
  id: string;
  label: string;
};

type Blog = {
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
  tags: BlogTag[];
};

type BlogPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  links: {
    self: string;
    first: string;
    prev: string | null;
    next: string | null;
    last: string;
  };
};

const dummyBlogs: Blog[] = [
  {
    id: "cm95udnpc0001s0d0bq7hfsv7",
    slug: "the-rise-of-intelligent-ai-agents-in-modern-technology-1743956007741",
    title: "The Rise of Intelligent AI Agents in Modern Technology",
    description:
      "Artificial Intelligence agents are transforming the way we interact with technology, offering unprecedented levels of automation and decision-making. From virtual assistants to complex problem-solving systems, AI agents are becoming integral to industries worldwide. This blog explores their capabilities, impact, and future potential in shaping our digital landscape.",
    image_url:
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    content:
      "<p>In recent years, AI agents have evolved from simple rule-based systems to sophisticated entities capable of learning, reasoning, and adapting to dynamic environments. These agents, powered by advanced algorithms and machine learning, can perform tasks ranging from customer service to scientific research. At xAI, our mission to accelerate human scientific discovery is driven by such intelligent agents, like Grok, which assist users in understanding the universe. As AI continues to advance, these agents promise to revolutionize productivity, creativity, and problem-solving across all sectors.</p>",
    createdAt: "2025-04-06T16:13:27.743Z",
    updatedAt: "2025-04-06T16:13:27.743Z",
    readingTime: "1 min",
    isHidden: false,
    tags: [
      {
        id: "cm952m7xe0000s0sk3j3cnzu4",
        label: "Technology",
      },
      {
        id: "cm952s6xc0000s0qssd9z7ue4",
        label: "Artificial Intelligence",
      },
    ],
  },
];

const dummyPagination: BlogPagination = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false,
  links: {
    self: "http://localhost:8080/api/v1/admin/blogs/blog?limit=10&page=1",
    first:
      "http://localhost:8080/api/v1/admin/blogs/blog?limit=10&page=1?page=1",
    prev: null,
    next: null,
    last: "http://localhost:8080/api/v1/admin/blogs/blog?limit=10&page=1?page=1",
  },
};
