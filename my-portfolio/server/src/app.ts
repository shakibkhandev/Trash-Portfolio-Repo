import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import requestIp from "request-ip"; // Import the request-ip module
import { errorHandler } from "./middlewares/error.middlewares";
import { routes } from "./routes";
import { ApiError } from "./utils/ApiError";
import morganMiddleware from "./logger/morgan.logger";

dotenv.config();

const app = express();



// Apply CORS middleware globally
app.use(
    cors({
      origin: "*", // No trailing slash
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Include OPTIONS explicitly
      credentials: true, // Allow cookies/authorization headers
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  const middleware = [express.json(), express.urlencoded({ extended: true })];
  
  app.use(middleware);
  
  app.use(requestIp.mw());


  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req, res) => {
      return req.clientIp || "unknown"; // Provide a fallback value if clientIp is undefined
    },
    handler: (_, __, ___, options) => {
      throw new ApiError(
        options.statusCode || 500,
        `There are too many requests. You are only allowed ${
          options.max
        } requests per ${options.windowMs / 60000} minutes`
      );
    },
  });


  // Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(morganMiddleware);

app.use("/api/v1", routes);


app.use(errorHandler);

export default app;