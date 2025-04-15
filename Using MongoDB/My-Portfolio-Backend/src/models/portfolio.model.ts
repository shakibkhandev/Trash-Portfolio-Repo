import mongoose, { Schema } from "mongoose";

const PortfolioSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    about: String,
    bio: { type: String, default: "Nothing To Say" },
    image_url: String,
    x_url: String,
    github_url: String,
    linkedin_url: String,
    facebook_url: String,
    educations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "educations",
      },
    ],
    workexperiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workexperiences",
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
      },
    ],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export const Portfolio = mongoose.model("portfolios", PortfolioSchema);
