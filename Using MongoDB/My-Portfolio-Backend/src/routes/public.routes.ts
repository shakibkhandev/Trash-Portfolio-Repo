import express from "express";
import { getPortfolio } from "../controllers/portfolio.controllers";
export const publicRoutes = express.Router();

publicRoutes.get("/portfolio", getPortfolio);
