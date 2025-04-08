import express from "express";
import { accessAdminPanel } from "../controllers/access.controllers";

export const accessRoutes = express.Router();

accessRoutes.post("/", accessAdminPanel);
