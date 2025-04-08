"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./auth.routes");
const blog_routes_1 = require("./blog.routes");
const user_routes_1 = require("./user.routes");
const health_routes_1 = require("./health.routes");
exports.routes = express_1.default.Router();
exports.routes.use("/auth", auth_routes_1.authRoutes);
exports.routes.use("/blogs", blog_routes_1.blogRoutes);
exports.routes.use("/users", user_routes_1.userRoutes);
exports.routes.use("/", health_routes_1.healthRoutes);
