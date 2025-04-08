import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getNewsletters = asyncHandler(async (req: any, res) => {
  // Extract pagination parameters from query string with defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Get total count for pagination metadata
  const totalNewsletters = await prisma.newsletter.count();

  // Fetch newsletters with pagination
  const newsletters = await prisma.newsletter.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      createdAt: "desc", // Optional: order by creation date
    },
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalNewsletters / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Generate pagination links
  const baseUrl = `${req.protocol}://${req.get("host")}${req.path}`;
  const links = {
    self: `${baseUrl}?page=${page}&limit=${limit}`,
    first: `${baseUrl}?page=1&limit=${limit}`,
    last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
    next: hasNextPage ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
    prev: hasPrevPage ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
  };

  // Response data structure
  const responseData = {
    newsletters,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalNewsletters,
      itemsPerPage: limit,
      hasNextPage,
      hasPrevPage,
    },
    links,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, responseData, "Newsletters fetched successfully")
    );
});

export const deleteNewsletter = asyncHandler(async (req: any, res) => {
  const newsletterId = req.params.id;

  if (!newsletterId) {
    throw new ApiError(400, "Newsletter ID is required");
  }

  const existNewsletter = await prisma.newsletter.findUnique({
    where: { id: newsletterId },
  });

  if (!existNewsletter) {
    throw new ApiError(404, "Newsletter not found");
  }
  await prisma.newsletter.delete({
    where: { id: newsletterId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Newsletter deleted successfully"));
});

export const addNewsletter = asyncHandler(async (req: any, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const existNewsletter = await prisma.newsletter.findUnique({
    where: {
      email: email,
    },
  });

  if (existNewsletter) {
    return res
      .status(200)
      .json(new ApiResponse(200, existNewsletter, "Email added successfully"));
  }
  const newsletter = await prisma.newsletter.create({
    data: {
      email: email,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newsletter, "Email added successfully"));
});
