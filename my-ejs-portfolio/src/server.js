// Load environment variables from .env file
require("dotenv").config();

// Import required modules
const express = require("express");
const path = require("path");
const morgan = require("morgan"); // For logging HTTP requests
const rateLimit = require("express-rate-limit"); // For rate limiting
const fs = require("fs").promises;

// Initialize the Express app
const app = express();

// Define the port from environment variables or default to 3000
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configure rate limiter for all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).render("rate-limit");
  },
});

// Apply rate limiting to all routes
app.use(limiter);

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Use morgan for logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Read portfolio data
async function getPortfolioData() {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "public/data/data.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return null;
  }
}

// Basic route
app.get("/", async (req, res) => {
  const portfolioData = await getPortfolioData();
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.render("index", {
    title: "Shakib Khan - Portfolio",
    ...portfolioData,
  });
});

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).render("not-found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `☕ Take a coffee and relax, Server is running on http://localhost:${PORT}`
  );
});
