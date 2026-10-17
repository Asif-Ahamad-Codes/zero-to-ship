import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    resumeFileName: {
      type: String,
      required: true,
      trim: true,
    },
    resumeSize: {
      type: Number,
      required: true,
      min: 1,
    },
    jobDescription: {
      type: String,
      required: true,
      maxlength: 50000,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedSkills: {
      type: [String],
      required: true,
    },
    missingSkills: {
      type: [String],
      required: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    creditsPercentLeft: {
      type: Number,
      min: 0,
      max: 100,
    },
    isMock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Analysis", analysisSchema);
