import { Education } from "../models/education.model";
import { Portfolio } from "../models/portfolio.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getEducations = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const educations = await Education.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, educations, "Educations fetched successfully"));
});

export const addEducation = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const newEducation = new Education({
    institution: req.body.institution,
    degree: req.body.degree,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    portfolioId: portfolio[0]._id,
  });

  await newEducation.save();

  // Update the portfolio's educations array
  await Portfolio.findByIdAndUpdate(
    portfolio[0]._id,
    {
      $push: { educations: newEducation._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, newEducation, "Education added successfully"));
});

export const updateEducation = asyncHandler(async (req: any, res) => {
  const educationId = req.params.id;

  if (!educationId) {
    throw new ApiError(400, "Education ID is required");
  }

  const existEducation = await Education.findById(educationId);

  if (!existEducation) {
    throw new ApiError(404, "Education not found");
  }

  const education = await Education.findByIdAndUpdate(
    educationId,
    {
      institution: req.body.institution,
      degree: req.body.degree,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      status: req.body.status,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, education, "Education updated successfully"));
});

export const deleteEducation = asyncHandler(async (req: any, res) => {
  const educationId = req.params.id;
  if (!educationId) {
    throw new ApiError(400, "Education ID is required");
  }

  const existEducation = await Education.findById(educationId);

  if (!existEducation) {
    throw new ApiError(404, "Education not found");
  }

  // Remove the education from the portfolio's educations array
  await Portfolio.findByIdAndUpdate(
    existEducation.portfolioId,
    {
      $pull: { educations: educationId },
    },
    { new: true }
  );

  await Education.findByIdAndDelete(educationId);

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Education deleted successfully"));
});
