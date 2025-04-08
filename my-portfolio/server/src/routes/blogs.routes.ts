import express from "express";
import {
  createBlog,
  createTag,
  deleteBlog,
  deleteTag,
  getBlogById,
  getBlogs,
  getTags,
  hideBlog,
  unhideBlog,
  updateBlog,
  updateTag,
} from "../controllers/blogs.controllers";

export const blogRoutes = express.Router();

blogRoutes.post("/blog", createBlog);
blogRoutes.get("/blog", getBlogs);
blogRoutes.get("/blog/:id", getBlogById);
blogRoutes.put("/blog/:id", updateBlog);
blogRoutes.delete("/blog/:id", deleteBlog);
blogRoutes.put("/blog/:id/hide", hideBlog);
blogRoutes.put("/blog/:id/unhide", unhideBlog);

blogRoutes.post("/tags/", createTag);
blogRoutes.put("/tags/:id", updateTag);
blogRoutes.delete("/tags/:id", deleteTag);
blogRoutes.get("/tags/", getTags);
