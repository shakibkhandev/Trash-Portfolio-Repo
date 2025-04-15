import express from "express";
import { verifyAdmin } from "../middlewares/verify.middlewares";
import { accessRoutes } from "./access.routes";
import { educationRoutes } from "./education.routes";
import { healthRoutes } from "./health.routes";
import { portfolioRoutes } from "./portfolio.routes";
import { projectsRoutes } from "./projects.routes";
import { publicRoutes } from "./public.routes";
import { skillsRoutes } from "./skills.routes";
import { workExperienceRoutes } from "./workexperiences.routes";

export const routes = express.Router();

routes.use("/", healthRoutes);

// Public routes
routes.use("/public", publicRoutes);

// Admin routes
routes.use("/admin/projects", verifyAdmin, projectsRoutes);
routes.use("/admin/work-experience", verifyAdmin, workExperienceRoutes);
routes.use("/admin/education", verifyAdmin, educationRoutes);
routes.use("/admin/skills", verifyAdmin, skillsRoutes);
routes.use("/admin/portfolio", verifyAdmin, portfolioRoutes);

// Access routes
routes.use("/admin/access", accessRoutes);
