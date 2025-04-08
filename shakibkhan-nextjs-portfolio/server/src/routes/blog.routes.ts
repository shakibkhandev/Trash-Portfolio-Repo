import express from "express";
import { verifyJWT } from "../middlewares/verify.middlewares";
import { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog, hideBlog, unhideBlog, publicBlogs, getBlogBySlug, createTag, getTags, updateTag, deleteTag, deleteAllTags } from "../controllers/blog.controllers";

export const blogRoutes = express.Router();

blogRoutes.post("/tags", verifyJWT, createTag)
blogRoutes.get("/tags", verifyJWT, getTags)
blogRoutes.put("/tags/:id", verifyJWT, updateTag)
blogRoutes.delete("/tags/:id", verifyJWT, deleteTag)
blogRoutes.delete("/tags/delete/all", verifyJWT, deleteAllTags)

blogRoutes.patch("/hide/:id", verifyJWT, hideBlog);
blogRoutes.patch("/unhide/:id", verifyJWT, unhideBlog);
blogRoutes.post("/", verifyJWT, createBlog);
blogRoutes.get("/", verifyJWT, getBlogs);
blogRoutes.get("/public", publicBlogs);
blogRoutes.get("/:id", verifyJWT, getBlogById);
blogRoutes.get("/slug/:slug", getBlogBySlug);
blogRoutes.put("/:id", verifyJWT, updateBlog);
blogRoutes.delete("/:id", verifyJWT, deleteBlog);


