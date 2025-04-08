import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getProjects = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const projects = await prisma.project.findMany({
    where: {
      portfolioId: portfolio[0].id,
    },
    include: {
      skills: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const getProjectById = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;

  // Validate projectId
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      },
      include:{
        skills: true
      }
    });

    // Check if project exists
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, project, "Project fetched successfully"));
  } catch (error) {
    // Handle any database errors
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Error fetching project");
  }
});

export const addProject = asyncHandler(async (req: any, res) => {
  if (!req.body) {
    throw new ApiError(
      400,
      "No data found. All fields are required"
    );
  }

  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const project = await prisma.project.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      image_url: req.body.image_url,
      web_url: req.body.web_url,
      portfolioId: portfolio[0].id,
      skills: {
        connect: req.body.skills.map((item: any) => ({ id: item })),
      },
    },
    include: {
      skills: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project added successfully"));
});

export const updateProject = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const existProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!existProject) {
    throw new ApiError(404, "Project not found");
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      image_url: req.body.image_url,
      web_url: req.body.web_url,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const existProject = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!existProject) {
    throw new ApiError(404, "Project not found");
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Project deleted successfully"));
});
