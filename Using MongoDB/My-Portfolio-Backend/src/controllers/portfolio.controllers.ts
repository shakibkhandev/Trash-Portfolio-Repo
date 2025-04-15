import { Portfolio } from "../models/portfolio.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getPortfolio = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find()
    .populate("educations")
    .populate("workexperiences")
    .populate({
      path: "projects",
      populate: {
        path: "skills",
      },
    })
    .populate("skills");

  if (portfolio.length < 1) {
    return res.status(200).json(
      new ApiResponse(
        200,
        [
          {
            education: [],
            workExperience: [],
            projects: [],
            skills: [],
          },
        ],
        "Portfolio not found"
      )
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        portfolio[0],
        "Portfolio information fetched successfully"
      )
    );
});

export const getPortfolioInformation = asyncHandler(async (req: any, res) => {
  const portfolio = await Portfolio.find().select(
    "-projects -skills -educations -workexperiences"
  );

  if (portfolio.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, portfolio, "Portfolio not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        portfolio,
        "Portfolio information fetched successfully"
      )
    );
});

export const createPortfolio = asyncHandler(async (req: any, res) => {
  const {
    email,
    name,
    bio,
    about,
    image_url,
    x_url,
    github_url,
    linkedin_url,
    facebook_url,
  } = req.body;

  // Check if portfolio already exists
  const portfolio = await Portfolio.find();
  if (portfolio.length > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, portfolio[0], "Portfolio Already Available"));
  }

  // Validate required fields
  if (
    !email ||
    !name ||
    !bio ||
    !about ||
    !image_url ||
    !x_url ||
    !github_url ||
    !linkedin_url ||
    !facebook_url
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const newPortfolio = await Portfolio.create({
    email,
    name,
    bio,
    about,
    image_url,
    x_url,
    github_url,
    linkedin_url,
    facebook_url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPortfolio, "Portfolio created successfully"));
});

export const updatePortfolio = asyncHandler(async (req: any, res) => {
  const existPortfolio = await Portfolio.find();
  if (existPortfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const portfolio = await Portfolio.findByIdAndUpdate(
    existPortfolio[0]._id,
    {
      name: req.body.name,
      email: req.body.email,
      about: req.body.about,
      bio: req.body.bio,
      image_url: req.body.image_url,
      x_url: req.body.x_url,
      github_url: req.body.github_url,
      linkedin_url: req.body.linkedin_url,
      facebook_url: req.body.facebook_url,
    },
    { new: true }
  ).select("-projects -skills -educations -workexperiences");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        portfolio,
        "Portfolio information updated successfully"
      )
    );
});

export const deletePortfolio = asyncHandler(async (req: any, res) => {
  await Portfolio.deleteMany({});

  return res
    .status(200)
    .json(new ApiResponse(200, undefined, "Portfolio deleted successfully"));
});
