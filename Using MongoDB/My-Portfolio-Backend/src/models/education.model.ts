import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
    },
    institution: {
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
    },
  },
  {
    timestamps: true,
  }
);

export const Education = mongoose.model("educations", EducationSchema);
