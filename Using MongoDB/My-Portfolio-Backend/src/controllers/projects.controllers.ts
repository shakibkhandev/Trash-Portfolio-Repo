import { Portfolio } from "../models/portfolio.model";
import { Projects } from "../models/projects.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getProjects = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const projects = await Projects.find({
    portfolioId: portfolio[0]._id,
  }).populate("skills");

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
    const project = await Projects.findById(projectId).populate("skills");

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
    throw new ApiError(400, "No data found. All fields are required");
  }

  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const project = await Projects.create({
    name: req.body.name,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    image_url: req.body.image_url,
    web_url: req.body.web_url,
    portfolioId: portfolio[0]._id,
    skills: req.body.skills,
  });

  // Update the portfolio's projects array
  await Portfolio.findByIdAndUpdate(
    portfolio[0]._id,
    {
      $push: { projects: project._id },
    },
    { new: true }
  );

  await project.populate("skills");

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project added successfully"));
});

export const updateProject = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const existProject = await Projects.findById(projectId);

  if (!existProject) {
    throw new ApiError(404, "Project not found");
  }

  const project = await Projects.findByIdAndUpdate(
    projectId,
    {
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      image_url: req.body.image_url,
      web_url: req.body.web_url,
      skills: req.body.skills,
    },
    { new: true }
  ).populate("skills");

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const existProject = await Projects.findById(projectId);

  if (!existProject) {
    throw new ApiError(404, "Project not found");
  }

  // Remove from portfolio's projects array
  await Portfolio.findByIdAndUpdate(
    existProject.portfolioId,
    {
      $pull: { projects: projectId },
    },
    { new: true }
  );

  await Projects.findByIdAndDelete(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Project deleted successfully"));
});
