import express from 'express';
import { authRoutes } from './auth.routes';
import { blogRoutes } from './blog.routes';
import { userRoutes } from './user.routes';
import { healthRoutes } from './health.routes';


export const routes = express.Router();

routes.use("/auth", authRoutes)
routes.use("/blogs", blogRoutes)
routes.use("/users", userRoutes)
routes.use("/", healthRoutes)