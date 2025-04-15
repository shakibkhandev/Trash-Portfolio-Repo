import { Portfolio } from "../models/portfolio.model";
import { Skills } from "../models/skills.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getSkills = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const skills = await Skills.find({ portfolioId: portfolio[0]._id });

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills fetched successfully"));
});

export const addSkill = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const existSkill = await Skills.findOne({ label: req.body.label });

  if (existSkill) {
    throw new ApiError(400, "Skill already exists");
  }

  const skill = await Skills.create({
    label: req.body.label,
    url: req.body.url,
    portfolioId: portfolio[0]._id,
  });

  // Update the portfolio's skills array
  await Portfolio.findByIdAndUpdate(
    portfolio[0]._id,
    {
      $push: { skills: skill._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill added successfully"));
});

export const updateSkill = asyncHandler(async (req: any, res) => {
  const skillId = req.params.id;
  if (!skillId) {
    throw new ApiError(400, "Skill ID is required");
  }

  const existSkill = await Skills.findById(skillId);

  if (!existSkill) {
    throw new ApiError(404, "Skill not found");
  }

  const skill = await Skills.findByIdAndUpdate(
    skillId,
    {
      label: req.body.label,
      url: req.body.url,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill updated successfully"));
});

export const deleteSkill = asyncHandler(async (req: any, res) => {
  const skillId = req.params.id;
  if (!skillId) {
    throw new ApiError(400, "Skill ID is required");
  }

  const existSkill = await Skills.findById(skillId);

  if (!existSkill) {
    throw new ApiError(404, "Skill not found");
  }

  // Remove from portfolio's skills array
  await Portfolio.findByIdAndUpdate(
    existSkill.portfolioId,
    {
      $pull: { skills: skillId },
    },
    { new: true }
  );

  await Skills.findByIdAndDelete(skillId);

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Skill deleted successfully"));
});
