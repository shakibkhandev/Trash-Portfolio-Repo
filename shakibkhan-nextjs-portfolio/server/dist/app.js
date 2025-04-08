"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const request_ip_1 = __importDefault(require("request-ip")); // Import the request-ip module
const error_middlewares_1 = require("./middlewares/error.middlewares");
const routes_1 = require("./routes");
const ApiError_1 = require("./utils/ApiError");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Apply CORS middleware globally
app.use((0, cors_1.default)({
    origin: "*", // No trailing slash
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Include OPTIONS explicitly
    credentials: true, // Allow cookies/authorization headers
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const middleware = [express_1.default.json(), express_1.default.urlencoded({ extended: true })];
app.use(middleware);
app.use(request_ip_1.default.mw());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
        return req.clientIp || "unknown"; // Provide a fallback value if clientIp is undefined
    },
    handler: (_, __, ___, options) => {
        throw new ApiError_1.ApiError(options.statusCode || 500, `There are too many requests. You are only allowed ${options.max} requests per ${options.windowMs / 60000} minutes`);
    },
});
// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use("/api/v1", routes_1.routes);
app.use(error_middlewares_1.errorHandler);
exports.default = app;
