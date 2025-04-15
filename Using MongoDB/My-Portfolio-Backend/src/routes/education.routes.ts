import express from "express";
import { addEducation, deleteEducation, getEducations, updateEducation } from "../controllers/education.controllers";

export const educationRoutes = express.Router();

educationRoutes.get("/", getEducations);
educationRoutes.post("/", addEducation);
educationRoutes.put("/:id", updateEducation);
educationRoutes.delete("/:id", deleteEducation);