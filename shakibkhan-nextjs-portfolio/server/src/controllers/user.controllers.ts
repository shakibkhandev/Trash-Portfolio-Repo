import { prisma } from "../services/prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getProfileInformation = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      provider: true,
      isAdmin: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Profile information fetched successfully")
    );
});

export const updateProfileInformation = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
      avatar: req.body.avatar,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Profile information updated successfully")
    );
});

export const deleteProfileInformation = asyncHandler(async (req: any, res) => {
  const userId = req.user.id;

  const user = await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Profile information deleted successfully")
    );
});

export const changeCurrentPassword = asyncHandler(async (req: any, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (oldPassword !== user?.password) {
    throw new ApiError(400, "Invalid old password");
  }

  if (newPassword !== confirmNewPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  // assign new password in plain text
  // We have a pre save method attached to user schema which automatically hashes the password whenever added/modified
  await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      password: newPassword,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export const getPortfolioInformation = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany({
    include: {
      education: true,
      workExperience: true,
      projects: {
        include: {
          skills: true,
        },
      },
      skills: true,
    },
  });

  if (portfolio.length < 1) {
    return res.status(200).json(new ApiResponse(200, portfolio, "Portfolio not found"));
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

export const updatePortfolioInformation = asyncHandler(
  async (req: any, res) => {
    const existPortfolio = await prisma.portfolio.findMany();
    if (existPortfolio.length < 1) {
      throw new ApiError(404, "Portfolio not found");
    }
    const portfolio = await prisma.portfolio.update({
      where: {
        id: existPortfolio[0].id,
      },
      data: {
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
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          portfolio,
          "Portfolio information updated successfully"
        )
      );
  }
);

export const deletePortfolioInformation = asyncHandler(
  async (req: any, res) => {
    const portfolio = await prisma.portfolio.deleteMany();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          portfolio,
          "Portfolio information deleted successfully"
        )
      );
  }
);
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
  const portfolio = await prisma.portfolio.findMany();
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

  const newPortfolio = await prisma.portfolio.create({
    data: {
      email,
      name,
      bio,
      about,
      image_url,
      x_url,
      github_url,
      linkedin_url,
      facebook_url,
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPortfolio, "Portfolio created successfully"));
});

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

  const workExperience = await prisma.workExperience.delete({
    where: {
      id: workExperienceId,
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        workExperience,
        "Work experience deleted successfully"
      )
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

export const addSkills = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
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

  const skill = await prisma.skill.delete({
    where: {
      id: skillId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill deleted successfully"));
});

export const getProjects = asyncHandler(async (req: any, res) => {
  const portfolio = await prisma.portfolio.findMany();

  if (portfolio.length < 1) {
    throw new ApiError(404, "Portfolio not found");
  }

  const projects = await prisma.project.findMany({
    where: {
      portfolioId: portfolio[0].id,
    },
    include:{
      skills:true
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

export const addProject = asyncHandler(async (req: any, res) => {
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
        connect: req.body.skills.map((item: any) => ({ id: item }))
      }
    },
    include:{
      skills:true
    }
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project added successfully"));
});

export const updateProject = asyncHandler(async (req: any, res) => {
  const projectId = req.params.id;

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

  const project = await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project deleted successfully"));
});

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

  const education = await prisma.education.delete({
    where: {
      id: educationId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, education, "Education deleted successfully"));
});

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
      createdAt: 'desc' // Optional: order by creation date
    }
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalNewsletters / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Generate pagination links
  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
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
      hasPrevPage
    },
    links
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        "Newsletters fetched successfully"
      )
    );
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


export const deleteNewsletter = asyncHandler(async (req: any, res) => {
  const newsletterId = req.params.id;

  const newsletter = await prisma.newsletter.delete({
    where: { id: newsletterId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newsletter, "Newsletter deleted successfully"));
});
