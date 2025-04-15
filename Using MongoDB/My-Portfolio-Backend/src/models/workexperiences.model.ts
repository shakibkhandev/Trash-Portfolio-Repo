import mongoose from "mongoose";
const { Schema } = mongoose;

const WorkExperienceSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "portfolios",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const WorkExperiences = mongoose.model(
  "workexperiences",
  WorkExperienceSchema
);
