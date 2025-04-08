import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200; // Average reading speed
  // Count words by splitting on whitespace and filtering out empty strings
  const wordCount = content
    .split(/\s+/)
    .filter((word: string) => word.length > 0).length;
  // Calculate minutes and round up to nearest integer
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readingTime} min`;
};

export const createBlog = asyncHandler(async (req: any, res: any) => {
  const { title, description, content, tags, image_url } = req.body;

  if (!title || !description || !content || !tags || !image_url) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Calculate reading time before creating the blog
  const readingTime = calculateReadingTime(content);

  if (!readingTime) {
    return res.status(400).json({ message: "Something went wrong" });
  }

  if (tags.length === 0) {
    return res.status(400).json({ message: "Tags are required" });
  }

  if (tags.length > 3) {
    return res.status(400).json({ message: "You can only add 3 tags" });
  }

  const slug = `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}`;

  const blog = await prisma.blog.create({
    data: {
      title,
      description,
      content,
      tags: {
        connect: tags.map((id: string) => ({
          id,
        })),
      },
      image_url,
      slug,
      readingTime,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});

export const getBlogs = asyncHandler(async (req: any, res: any) => {
  // Get page and limit from query parameters, with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Calculate skip value based on page and limit
  const skip = (page - 1) * limit;

  // Fetch blogs with pagination
  const blogs = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tags: true,
    },
  });

  // Optional: Get total count for pagination metadata
  const totalBlogs = await prisma.blog.count();
  const totalPages = Math.ceil(totalBlogs / limit);

  return res.status(200).json(
    new ApiResponse(200, blogs, "Blogs fetched successfully", {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalBlogs,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        first: `${req.protocol}://${req.get("host")}${req.originalUrl}?page=1`,
        prev:
          page > 1
            ? `${req.protocol}://${req.get("host")}${req.originalUrl}?page=${
                page - 1
              }`
            : null,
        next:
          page < totalPages
            ? `${req.protocol}://${req.get("host")}${req.originalUrl}?page=${
                page + 1
              }`
            : null,
        last: `${req.protocol}://${req.get("host")}${
          req.originalUrl
        }?page=${totalPages}`,
      },
    })
  );
});

export const getBlogById = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Blog ID is required",
    });
  }

  // Fetch blog by ID
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      tags: true,
    },
  });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Blog fetched successfully",
    data: blog,
  });
});

export const updateBlog = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const { title, description, content, tags, image_url } = req.body;

  if (!id || !title || !description || !content || !tags || !image_url) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (tags.length === 0) {
    return res.status(400).json({ message: "Tags are required" });
  }

  if (tags.length > 3) {
    return res.status(400).json({ message: "You can only add 3 tags" });
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      tags: true, // Include existing tags
    },
  });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  const existingTagLabels = blog.tags.map((tag: any) => tag.label);
  const newTagsToAdd = tags.filter(
    (tag: string) => !existingTagLabels.includes(tag)
  );

  const updatedBlog = await prisma.blog.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      content,
      readingTime: calculateReadingTime(content),
      tags: {
        create: newTagsToAdd.map((tag: string) => ({
          label: tag,
        })),
      },
      image_url,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Blog updated successfully",
    data: updatedBlog,
  });
});

export const deleteBlog = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json(new ApiError(400, "Blog ID is required"));
  }
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    return res.status(404).json(new ApiError(404, "Blog not found"));
  }
  await prisma.blog.delete({
    where: {
      id,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Blog deleted successfully"));
});

export const hideBlog = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  console.log(id);

  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  await prisma.blog.update({
    where: {
      id,
    },
    data: {
      isHidden: true,
    },
  });
  return res.status(200).json({
    success: true,
    message: "Blog hidden successfully",
  });
});

export const unhideBlog = asyncHandler(async (req: any, res: any) => {
  const { id } = req.params;
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  await prisma.blog.update({
    where: {
      id,
    },
    data: {
      isHidden: false,
    },
  });
  return res.status(200).json({
    success: true,
    message: "Blog unhidden successfully",
  });
});

export const publicBlogs = asyncHandler(async (req: any, res: any) => {
  // Get page and limit from query parameters, with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Calculate skip value based on page and limit
  const skip = (page - 1) * limit;

  // Fetch blogs with pagination
  const blogs = await prisma.blog.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    where: {
      isHidden: false,
    },
    include: {
      tags: true,
    },
  });

  // Optional: Get total count for pagination metadata
  const totalBlogs = await prisma.blog.count();
  const totalPages = Math.ceil(totalBlogs / limit);

  return res.status(200).json(
    new ApiResponse(200, blogs, "Blogs fetched successfully", {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalBlogs,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        first: `${req.protocol}://${req.get("host")}${req.originalUrl}?page=1`,
        prev:
          page > 1
            ? `${req.protocol}://${req.get("host")}${req.originalUrl}?page=${
                page - 1
              }`
            : null,
        next:
          page < totalPages
            ? `${req.protocol}://${req.get("host")}${req.originalUrl}?page=${
                page + 1
              }`
            : null,
        last: `${req.protocol}://${req.get("host")}${
          req.originalUrl
        }?page=${totalPages}`,
      },
    })
  );
});

export const getBlogBySlug = asyncHandler(async (req: any, res: any) => {
  const { slug } = req.params;
  // Get page and limit from query parameters, with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Fetch current blog
  const blog = await prisma.blog.findFirst({
    where: {
      slug: slug,
      isHidden: false,
    },
    include: {
      tags: true,
    },
  });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  // Get total count of blogs for pagination
  const totalBlogs = await prisma.blog.count({
    where: {
      isHidden: false,
    },
  });

  // Find next blog
  const nextBlog = await prisma.blog.findFirst({
    where: {
      isHidden: false,
      createdAt: {
        gt: blog.createdAt,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      slug: true,
    },
  });

  // Find previous blog
  const previousBlog = await prisma.blog.findFirst({
    where: {
      isHidden: false,
      createdAt: {
        lt: blog.createdAt,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      slug: true,
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalBlogs / limit);
  const hasNext = nextBlog !== null;
  const hasPrevious = previousBlog !== null;

  return res.status(200).json(
    new ApiResponse(
      200,
      blog,
      "Blog fetched successfully",
      {
        currentPage: page,
        totalPages,
        totalItems: totalBlogs,
        itemsPerPage: limit,
      },
      {
        next: hasNext
          ? `${req.protocol}://${req.get("host")}/api/v1/public/blogs/${
              nextBlog?.slug
            }`
          : null,
        previous: hasPrevious
          ? `${req.protocol}://${req.get("host")}/api/v1/public/blogs/${
              previousBlog?.slug
            }`
          : null,
        hasNext: hasNext,
        hasPrevious: hasPrevious,
      }
    )
  );
});

export const createTag = asyncHandler(async (req: any, res: any) => {
  const { label } = req.body;
  if (!label) {
    throw new ApiError(400, "Label is required");
  }
  const existTag = await prisma.tag.findUnique({
    where: {
      label,
    },
  });

  if (existTag) {
    throw new ApiError(400, "Tag already exists");
  }
  const tag = await prisma.tag.create({
    data: {
      label,
    },
  });
  return res.status(200).json({
    success: true,
    message: "Tag created successfully",
    data: tag,
  });
});

export const updateTag = asyncHandler(async (req: any, res: any) => {
  if (!req.params.id) {
    throw new ApiError(400, "Tag ID is required");
  }
  const { label } = req.body;
  if (!label) {
    throw new ApiError(400, "Label is required");
  }
  const tag = await prisma.tag.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }
  const updatedTag = await prisma.tag.update({
    where: {
      id: req.params.id,
    },
    data: {
      label,
    },
  });
  return res.status(200).json({
    success: true,
    message: "Tag updated successfully",
    data: updatedTag,
  });
});

export const deleteTag = asyncHandler(async (req: any, res: any) => {
  if (!req.params.id) {
    throw new ApiError(400, "Tag ID is required");
  }

  const tag = await prisma.tag.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }
  await prisma.tag.delete({
    where: {
      id: req.params.id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Tag deleted successfully"));
});

export const getTags = asyncHandler(async (req: any, res: any) => {
  const tags = await prisma.tag.findMany();
  return res.status(200).json({
    success: true,
    message: "Tags fetched successfully",
    data: tags,
  });
});

export const deleteAllTags = asyncHandler(async (req: any, res: any) => {
  if (req.user.isAdmin !== true) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const tags = await prisma.tag.deleteMany();
  return res.status(200).json({
    success: true,
    message: "All tags deleted successfully",
    data: tags,
  });
});
