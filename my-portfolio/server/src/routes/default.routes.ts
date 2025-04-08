import express from "express";
import { healthCheck, serverRunning } from "../controllers/default.controllers";

export const defaultRoutes = express.Router();

defaultRoutes.get("/", serverRunning);
defaultRoutes.get("/health", healthCheck);
