import mongoose from "mongoose";
const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    web_url: {
      type: String,
      required: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "portfolios",
      required: true,
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Projects = mongoose.model("projects", ProjectSchema);
