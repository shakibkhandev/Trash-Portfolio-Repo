import express from "express";
import {
  accessAdminPanel,
  verifyToken,
} from "../controllers/access.controllers";

export const accessRoutes = express.Router();

accessRoutes.post("/", accessAdminPanel);
accessRoutes.post("/verify-token", verifyToken);
