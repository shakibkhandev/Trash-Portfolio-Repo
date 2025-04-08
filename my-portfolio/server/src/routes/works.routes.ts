import express from "express";
import {
  addWorkExperience,
  deleteWorkExperience,
  getWorkExperiences,
  updateWorkExperience,
} from "../controllers/works.controllers";

export const workExperienceRoutes = express.Router();

workExperienceRoutes.get("/", getWorkExperiences);
workExperienceRoutes.post("/", addWorkExperience);
workExperienceRoutes.put("/:id", updateWorkExperience);
workExperienceRoutes.delete("/:id", deleteWorkExperience);
