import express from "express";
import { getBlogBySlug, publicBlogs } from "../controllers/blogs.controllers";
import { addNewsletter } from "../controllers/newsletter.controllers";
import { getPortfolio } from "../controllers/portfolio.controllers";
export const publicRoutes = express.Router();

publicRoutes.get("/portfolio", getPortfolio);
publicRoutes.post("/newsletter", addNewsletter);
publicRoutes.get("/blogs", publicBlogs);
publicRoutes.get("/blogs/:slug", getBlogBySlug);
