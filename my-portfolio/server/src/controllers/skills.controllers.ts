import { prisma } from "../database";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getSkills = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const skills = await prisma.skill.findMany({
    where: {
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

export const addSkill = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const existSkill = await prisma.skill.findUnique({
    where: {
      label: req.body.label,
    },
  });

  if (existSkill) {
    throw new ApiError(400, "Skill already exists");
  }

  const skill = await prisma.skill.create({
    data: {
      label: req.body.label,
      url: req.body.url,
      portfolioId: portfolio[0].id,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill added successfully"));
});

export const updateSkill = asyncHandler(async (req: any, res) => {
  const skillId = req.params.id;

  const skill = await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: {
      label: req.body.label,
      url: req.body.url,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill updated successfully"));
});

export const deleteSkill = asyncHandler(async (req: any, res) => {
  const skillId = req.params.id;
  if (!skillId) {
    throw new ApiError(400, "Skill ID is required");
  }

  const existSkill = await prisma.skill.findUnique({
    where: {
      id: skillId,
    },
  });

  if (!existSkill) {
    throw new ApiError(404, "Skill not found");
  }

  await prisma.skill.delete({
    where: {
      id: skillId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Skill deleted successfully"));
});
