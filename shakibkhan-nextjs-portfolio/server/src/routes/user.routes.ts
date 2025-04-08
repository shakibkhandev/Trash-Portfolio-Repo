import express from "express";

import {
  addEducation,
  addNewsletter,
  addProject,
  addSkills,
  addWorkExperience,
  changeCurrentPassword,
  createPortfolio,
  deleteEducation,
  deleteNewsletter,
  deletePortfolioInformation,
  deleteProfileInformation,
  deleteProject,
  deleteSkill,
  deleteWorkExperience,
  getEducations,
  getNewsletters,
  getPortfolioInformation,
  getProfileInformation,
  getProjects,
  getSkills,
  getWorkExperiences,
  updateEducation,
  updatePortfolioInformation,
  updateProfileInformation,
  updateProject,
  updateSkill,
  updateWorkExperience,
} from "../controllers/user.controllers";
import { verifyJWT } from "../middlewares/verify.middlewares";

export const userRoutes = express.Router();

// profile
userRoutes.get("/profile", verifyJWT, getProfileInformation);
userRoutes.put("/profile", verifyJWT, updateProfileInformation);
userRoutes.delete("/profile", verifyJWT, deleteProfileInformation);
userRoutes.put("/profile/change-password", verifyJWT, changeCurrentPassword);

// Portfolio
userRoutes.get("/portfolio", getPortfolioInformation);
userRoutes.post("/portfolio", verifyJWT, createPortfolio);
userRoutes.put("/portfolio", verifyJWT, updatePortfolioInformation);
userRoutes.delete("/portfolio", verifyJWT, deletePortfolioInformation);

// Skills
userRoutes.get("/skills", getSkills);
userRoutes.post("/skills", verifyJWT, addSkills);
userRoutes.put("/skills/:id", verifyJWT, updateSkill);
userRoutes.delete("/skills/:id", verifyJWT, deleteSkill);

// Education
userRoutes.get("/education", getEducations);
userRoutes.post("/education", verifyJWT, addEducation);
userRoutes.put("/education/:id", verifyJWT, updateEducation);
userRoutes.delete("/education/:id", verifyJWT, deleteEducation);

// Work Experience
userRoutes.get("/work-experiences", getWorkExperiences);
userRoutes.post("/work-experiences", verifyJWT, addWorkExperience);
userRoutes.put("/work-experiences/:id", verifyJWT, updateWorkExperience);
userRoutes.delete("/work-experiences/:id", verifyJWT, deleteWorkExperience);

// Projects
userRoutes.get("/projects", getProjects);
userRoutes.post("/projects", verifyJWT, addProject);
userRoutes.put("/projects/:id", verifyJWT, updateProject);
userRoutes.delete("/projects/:id", verifyJWT, deleteProject);

// Newsletter
userRoutes.get("/newsletter", verifyJWT, getNewsletters);
userRoutes.post("/newsletter", addNewsletter);
userRoutes.delete("/newsletter/:id", verifyJWT, deleteNewsletter);
