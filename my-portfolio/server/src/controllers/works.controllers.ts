import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getWorkExperiences = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const workExperiences = await prisma.workExperience.findMany({
    where: {
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        workExperiences,
        "Work experiences fetched successfully"
      )
    );
});

export const updateWorkExperience = asyncHandler(async (req: any, res) => {
  const workExperienceId = req.params.id;

  const existWorkExperience = await prisma.workExperience.findUnique({
    where: {
      id: workExperienceId,
    },
  });

  if (!existWorkExperience) {
    throw new ApiError(404, "Work experience not found");
  }

  const workExperience = await prisma.workExperience.update({
    where: {
      id: workExperienceId,
    },
    data: {
      companyName: req.body.companyName,
      position: req.body.position,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        workExperience,
        "Work experience updated successfully"
      )
    );
});

export const deleteWorkExperience = asyncHandler(async (req: any, res) => {
  const workExperienceId = req.params.id;

  const existWorkExperience = await prisma.workExperience.findUnique({
    where: {
      id: workExperienceId,
    },
  });

  if (!existWorkExperience) {
    throw new ApiError(404, "Work experience not found");
  }

  await prisma.workExperience.delete({
    where: {
      id: workExperienceId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, undefined, "Work experience deleted successfully")
    );
});

export const addWorkExperience = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const workExperience = await prisma.workExperience.create({
    data: {
      companyName: req.body.companyName,
      position: req.body.position,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, workExperience, "Work experience added successfully")
    );
});
