import { Portfolio } from "../models/portfolio.model";
import { WorkExperiences } from "../models/workexperiences.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getWorkExperiences = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const workExperiences = await WorkExperiences.find({
    portfolioId: portfolio[0]._id,
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

export const addWorkExperience = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const workExperience = await WorkExperiences.create({
    company: req.body.company,
    role: req.body.role,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    portfolioId: portfolio[0]._id,
  });

  // Update the portfolio's workexperiences array
  await Portfolio.findByIdAndUpdate(
    portfolio[0]._id,
    {
      $push: { workexperiences: workExperience._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, workExperience, "Work experience added successfully")
    );
});

export const updateWorkExperience = asyncHandler(async (req: any, res) => {
  const workExperienceId = req.params.id;
  if (!workExperienceId) {
    throw new ApiError(400, "Work experience ID is required");
  }

  const existWorkExperience = await WorkExperiences.findById(workExperienceId);

  if (!existWorkExperience) {
    throw new ApiError(404, "Work experience not found");
  }

  const workExperience = await WorkExperiences.findByIdAndUpdate(
    workExperienceId,
    {
      company: req.body.company,
      role: req.body.role,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    },
    { new: true }
  );

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
  if (!workExperienceId) {
    throw new ApiError(400, "Work experience ID is required");
  }

  const existWorkExperience = await WorkExperiences.findById(workExperienceId);

  if (!existWorkExperience) {
    throw new ApiError(404, "Work experience not found");
  }

  // Remove from portfolio's workexperiences array
  await Portfolio.findByIdAndUpdate(
    existWorkExperience.portfolioId,
    {
      $pull: { workexperiences: workExperienceId },
    },
    { new: true }
  );

  await WorkExperiences.findByIdAndDelete(workExperienceId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, undefined, "Work experience deleted successfully")
    );
});
