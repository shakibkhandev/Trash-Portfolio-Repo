import mongoose from "mongoose";
const { Schema } = mongoose;

const SkillSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: false, // optional field
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

export const Skills = mongoose.model("skills", SkillSchema);
