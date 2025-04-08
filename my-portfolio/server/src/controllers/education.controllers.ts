import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getEducations = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const educations = await prisma.education.findMany({
    where: {
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, educations, "Educations fetched successfully"));
});

export const addEducation = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const education = await prisma.education.create({
    data: {
      institution: req.body.institution,
      degree: req.body.degree,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, education, "Education added successfully"));
});

export const updateEducation = asyncHandler(async (req: any, res) => {
  const educationId = req.params.id;

  if (!educationId) {
    throw new ApiError(400, "Education ID is required");
  }

  const existEducation = await prisma.education.findUnique({
    where: {
      id: educationId,
    },
  });

  if (!existEducation) {
    throw new ApiError(404, "Education not found");
  }

  const education = await prisma.education.update({
    where: {
      id: educationId,
    },
    data: {
      institution: req.body.institution,
      degree: req.body.degree,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, education, "Education updated successfully"));
});

export const deleteEducation = asyncHandler(async (req: any, res) => {
  const educationId = req.params.id;
  if (!educationId) {
    throw new ApiError(400, "Education ID is required");
  }

  const existEducation = await prisma.education.findUnique({
    where: {
      id: educationId,
    },
  });

  if (!existEducation) {
    throw new ApiError(404, "Education not found");
  }

  await prisma.education.delete({
    where: {
      id: educationId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Education deleted successfully"));
});
