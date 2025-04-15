import express from "express";
import { addSkill, deleteSkill, getSkills, updateSkill } from "../controllers/skills.controllers";
export const skillsRoutes = express.Router();

skillsRoutes.get("/", getSkills);
skillsRoutes.post("/", addSkill);
skillsRoutes.put("/:id", updateSkill);
skillsRoutes.delete("/:id", deleteSkill);