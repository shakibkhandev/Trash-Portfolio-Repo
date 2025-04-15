import express from "express";
import { healthCheck, serverRunning } from "../controllers/health.controllers";

export const healthRoutes = express.Router();

healthRoutes.get("/", serverRunning);
healthRoutes.get("/health", healthCheck);