import express from "express";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolioInformation,
  updatePortfolio,
} from "../controllers/portfolio.controllers";

export const portfolioRoutes = express.Router();

portfolioRoutes.get("/", getPortfolioInformation)
portfolioRoutes.post("/", createPortfolio);
portfolioRoutes.put("/", updatePortfolio);
portfolioRoutes.delete("/", deletePortfolio);
