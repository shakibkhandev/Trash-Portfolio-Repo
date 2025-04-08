import express from "express";
import { addProject, deleteProject, getProjects, updateProject, getProjectById } from "../controllers/projects.controllers";
export const projectsRoutes = express.Router();

projectsRoutes.get("/", getProjects);
projectsRoutes.get("/:id", getProjectById);

projectsRoutes.post("/", addProject);
projectsRoutes.put("/:id", updateProject);
projectsRoutes.delete("/:id", deleteProject);

