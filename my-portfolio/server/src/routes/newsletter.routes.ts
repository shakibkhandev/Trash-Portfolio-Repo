import express from "express";
import {
  deleteNewsletter,
  getNewsletters,
} from "../controllers/newsletter.controllers";

export const newsletterRoutes = express.Router();

newsletterRoutes.get("/", getNewsletters);
newsletterRoutes.delete("/:id", deleteNewsletter);
