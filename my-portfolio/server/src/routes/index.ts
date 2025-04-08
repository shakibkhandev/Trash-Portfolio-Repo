import express from "express";
import { verifyAdmin } from "../middlewares/verify.middlewares";
import { accessRoutes } from "./access.routes";
import { defaultRoutes } from "./default.routes";
import { educationRoutes } from "./education.routes";
import { portfolioRoutes } from "./portfolio.routes";
import { projectsRoutes } from "./projects.routes";
import { publicRoutes } from "./public.routes";
import { skillsRoutes } from "./skills.routes";
import { workExperienceRoutes } from "./works.routes";
import { newsletterRoutes } from "./newsletter.routes";
import { blogRoutes } from "./blogs.routes";
export const routes = express.Router();

// Public routes
routes.use("/public", publicRoutes);

// Admin routes
routes.use("/admin/projects", verifyAdmin, projectsRoutes);
routes.use("/admin/work-experience", verifyAdmin, workExperienceRoutes);
routes.use("/admin/education", verifyAdmin, educationRoutes);
routes.use("/admin/skills", verifyAdmin, skillsRoutes);
routes.use("/admin/portfolio", verifyAdmin, portfolioRoutes);
routes.use("/admin/newsletter", verifyAdmin, newsletterRoutes);
routes.use("/admin/blogs", verifyAdmin, blogRoutes);

// Access routes
routes.use("/admin/access", accessRoutes);

// Default routes
routes.use("/", defaultRoutes);
